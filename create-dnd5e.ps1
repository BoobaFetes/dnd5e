$ErrorActionPreference = "stop"
$scriptRoot = $PsScriptRoot

$shouldPublish = $false

$your_registry = "https://registry.npmjs.org/"

$workspace = @{
    dir          = "$scriptRoot/workspace"
    presentation = "$scriptRoot/workspace/apps/presentation";
    domain       = "$scriptRoot/workspace/libs/dnd5e-domain";
    api          = "$scriptRoot/workspace/libs/dnd5e-api";
    application  = "$scriptRoot/workspace/libs/dnd5e-application";
} 
try {
    if (Test-Path $workspace.dir) {
        throw "$($workspace.dir) exists, please save your work before run the script once again "
    }
   
    Set-Location $scriptRoot

    #region CREATION DE LA CLEAN ARCHITECTURE 
    npx create-nx-workspace@16.2.1 workspace --preset=apps --no-nxCloud -ci=github --pm=yarn
    Set-Location workspace

    yarn add @nx/react @nx/js

    @'
        {
            // Use IntelliSense to learn about possible attributes.
            // Hover to view descriptions of existing attributes.
            // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
            "version": "0.2.0",
            "configurations": [
              {
                "type": "chrome",
                "request": "launch",
                "name": "Launch Provider",
                "url": "http://localhost:3000",
                "webRoot": "${workspaceFolder}/apps/presentation"
              }
            ]
          }
'@ | set-content -path "$($workspace.dir)/.vscode/launch.json"

    # help : yarn nx g @nx/react:application --help
    yarn nx g @nx/react:application presentation --style=scss --routing --pascalCaseFiles --e2eTestRunner=none --no-strict --no-interactive
    [void](yarn nx daemon --stop=true)
    $project = get-content -path "$($workspace.presentation)/project.json" | convertfrom-json 
    $project.targets.serve.options `
    | Add-Member -MemberType NoteProperty -name "host" -value "127.0.0.1"
    $project.targets.serve.options `
    | Add-Member -MemberType NoteProperty -name "port" -value 3000
    $project | ConvertTo-Json -Depth 10 | set-content -path "$($workspace.presentation)/project.json"



    yarn nx g @nx/js:library dnd5e-domain --importPath=@boobafetes/dnd5e-domain --publishable --minimal --includeBabelRc --unitTestRunner=jest --no-interactive
    [void](yarn nx daemon --stop=true)
    $package = get-content -path "$($workspace.domain)/package.json" | convertfrom-json 
    $package `
    | Add-Member -MemberType NoteProperty -name "publishConfig" -value @{
        registry = $your_registry 
    }
    $package | ConvertTo-Json -Depth 10 | set-content -path "$($workspace.domain)/package.json"

    @'
export * from './lib';
'@ > "$($workspace.domain)/src/index.ts"    
    Remove-Item -Path "$($workspace.domain)/src/lib/*" -Force -Recurse    
    @'
export * from './dto/graphql';
'@ > "$($workspace.domain)/src/lib/index.ts"


    yarn nx g @nx/react:library dnd5e-application --importPath=@boobafetes/dnd5e-application --publishable --minimal --style=scss --bundler=rollup --routing --pascalCaseFiles --e2eTestRunner=none --no-strict --no-interactive
    [void](yarn nx daemon --stop=true)
    $project = get-content -path "$($workspace.application)/project.json" | convertfrom-json 
    $project.targets.build.options `
    | Add-Member -MemberType NoteProperty -name "buildableProjectDepsInPackageJsonType" -value $true    
    $project.targets.build.options `
    | Add-Member -MemberType NoteProperty -name "updateBuildableProjectDepsInPackageJson" -value $true
    $project.targets `
    | Add-Member -MemberType NoteProperty -name "publish" -value @{
        "command"   = "node tools/scripts/publish.mjs dnd5e-application {args.ver} {args.tag}";
        "dependsOn" = @("build");
    } 
    $project | ConvertTo-Json -Depth 10 | set-content -path "$($workspace.application)/project.json"

    $package = get-content -path "$($workspace.application)/package.json" | convertfrom-json 
    $package `
    | Add-Member -MemberType NoteProperty -name "publishConfig" -value @{
        registry = $your_registry 
    }
    $package | ConvertTo-Json -Depth 10 | set-content -path "$($workspace.application)/package.json"
    @'
export * from './lib';
'@ > "$($workspace.application)/src/index.ts"
    Remove-Item -Path "$($workspace.application)/src/lib/*" -Force -Recurse
    @'
export * from './?';
'@ > "$($workspace.application)/src/lib/index.ts"



    yarn nx g @nx/react:library dnd5e-api --importPath=@boobafetes/dnd5e-api --publishable --minimal --style=scss --bundler=rollup --routing --pascalCaseFiles --e2eTestRunner=none --no-strict --no-interactive
    [void](yarn nx daemon --stop=true)
    $project = get-content -path "$($workspace.api)/project.json" | convertfrom-json 
    $project.targets.build.options `
    | Add-Member -MemberType NoteProperty -name "buildableProjectDepsInPackageJsonType" -value $true    
    $project.targets.build.options `
    | Add-Member -MemberType NoteProperty -name "updateBuildableProjectDepsInPackageJson" -value $true
    $project.targets `
    | Add-Member -MemberType NoteProperty -name "publish" -value @{
        "command"   = "node tools/scripts/publish.mjs dnd5e-api {args.ver} {args.tag}";
        "dependsOn" = @("build");
    } 
    $project | ConvertTo-Json -Depth 10 | set-content -path "$($workspace.api)/project.json"

    $package = get-content -path "$($workspace.api)/package.json" | convertfrom-json 
    $package `
    | Add-Member -MemberType NoteProperty -name "publishConfig" -value @{
        registry = $your_registry 
    }
    $package | ConvertTo-Json -Depth 10 | set-content -path "$($workspace.api)/package.json"

    @'
export * from './lib';
'@ > "$($workspace.api)/src/index.ts"
    Remove-Item -Path "$($workspace.api)/src/lib/*" -Force -Recurse
    @'
export * from './?';
'@ > "$($workspace.api)/src/lib/index.ts"

    #endregion

    #region ajout des packages
    yarn add @apollo/client graphql @mui/material @emotion/react @emotion/styled @mui/icons-material
    #endregion

    #region génération des dtos dans la lib domain
    yarn add -D @graphql-codegen/cli @graphql-codegen/client-preset @graphql-codegen/introspection
    write-host "press Enter for every question from the cli wizard"
    yarn graphql-code-generator init
    @'
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'https://www.dnd5eapi.co/graphql',
  documents: undefined,
  generates: {
    './libs/dnd5e-domain/src/lib/dto/': {
      preset: 'client',
      plugins: [],
    },
    './libs/dnd5e-domain/src/lib/graphql.schema.json': {
      plugins: ['introspection'],
    },
  },
};

export default config;
'@ > "$($workspace.dir)/codegen.ts"

    yarn run codegen
    #endregion

    if ($shouldPublish) {
        yarn nx publish dnd5e-domain --ver 1.0.0 -tag latest
        yarn nx publish dnd5e-application --ver 1.0.0 -tag latest
        # yarn nx publish dnd5e-api --ver 1.0.0 -tag latest
    }
}
finally {
    set-location $scriptRoot
}