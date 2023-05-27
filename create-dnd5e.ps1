$ErrorActionPreference = "stop"
$scriptRoot = $PsScriptRoot

$your_registry = "https://registry.npmjs.org/"
$nxVersion = "@16.2.2";
$wkspName = "workspace-1"

$wksp = @{
    root               = "$scriptRoot/$wkspName";
    rootIsDone         = $false;
    presentation       = "$scriptRoot/$wkspName/apps/presentation";
    presentationIsDone = $false;
    domain             = "$scriptRoot/$wkspName/libs/dnd5e-domain";
    domainIsDone       = $false;
    api                = "$scriptRoot/$wkspName/libs/dnd5e-api";
    apiIsDone          = $false;
    application        = "$scriptRoot/$wkspName/libs/dnd5e-application";
    applicationIsDone  = $false;
} 

try {
    function Stop-NX-Daemon() {
        [void](yarn nx daemon --stop=true)
    }

    if (Test-Path $wksp.root) {
        throw "$($wksp.root) exists, please save your work before run the script once again "
    }
   
    Set-Location $scriptRoot

    #region CREATION DE LA CLEAN ARCHITECTURE 
    if (-not $wksp.rootIsDone) {
        set-content -path "$scriptRoot/.vscode/launch.json" -Value @'
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
        "webRoot": "${workspaceFolder}/__wksp__/apps/presentation"
        }
    ]
}
'@ -replace "__wksp__", $wksp.root
    
        invoke-command "npx create-nx-workspace$nxVersion workspace --preset=apps --no-nxCloud -ci=github --pm=yarn"

        Set-Location workspace
        invoke-command "yarn add @nx/react$nxVersion @nx/js$nxVersion"

        set-content -path "$($wksp.root)/.vscode/launch.json" -Value @'
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
'@
    }

    Set-Location $wksp.root

    # help : yarn nx g @nx/react:application --help
    if (-not $wksp.presentationIsDone) {
        yarn nx g @nx/react:application presentation --style=scss --routing --pascalCaseFiles --e2eTestRunner=none --no-strict --no-interactive
        Stop-NX-Daemon

        $project = get-content -path "$($wksp.presentation)/project.json" | convertfrom-json 
        $project.targets.serve.options `
        | Add-Member -MemberType NoteProperty -name "host" -value "127.0.0.1"
        $project.targets.serve.options `
        | Add-Member -MemberType NoteProperty -name "port" -value 3000
        $project | ConvertTo-Json -Depth 10 | set-content -path "$($wksp.presentation)/project.json"
    }


    if (-not $wksp.domainIsDone) {
        yarn nx g @nx/js:library dnd5e-domain --importPath=@boobafetes/dnd5e-domain --publishable --minimal --includeBabelRc --unitTestRunner=jest --no-interactive
        Stop-NX-Daemon
        $package = get-content -path "$($wksp.domain)/package.json" | convertfrom-json 
        $package `
        | Add-Member -MemberType NoteProperty -name "publishConfig" -value @{
            registry = $your_registry 
        }
        $package | ConvertTo-Json -Depth 10 | set-content -path "$($wksp.domain)/package.json"

        Set-content -path "$($wksp.domain)/src/index.ts" -value @'
export * from './lib';
'@  
        Remove-Item -Path "$($wksp.domain)/src/lib/*" -Force -Recurse    
        Set-content -path "$($wksp.domain)/src/lib/index.ts" -value @'
export * from './dto/graphql';
'@

        #region génération des dtos dans la lib domain
        yarn add -D @graphql-codegen/cli @graphql-codegen/client-preset @graphql-codegen/introspection
        write-host "press Enter for every question from the cli wizard"
        yarn graphql-code-generator init
        set-content -path "$($wksp.root)/codegen.ts" -value @'
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
'@

        yarn run codegen
        #endregion
    }

    if (-not $wksp.applicationIsDone) {
        yarn nx g @nx/react:library dnd5e-application --importPath=@boobafetes/dnd5e-application --publishable --minimal --style=scss --bundler=rollup --routing --pascalCaseFiles --e2eTestRunner=none --no-strict --no-interactive
        Stop-NX-Daemon
        $project = get-content -path "$($wksp.application)/project.json" | convertfrom-json 
        $project.targets.build.options `
        | Add-Member -MemberType NoteProperty -name "buildableProjectDepsInPackageJsonType" -value $true    
        $project.targets.build.options `
        | Add-Member -MemberType NoteProperty -name "updateBuildableProjectDepsInPackageJson" -value $true
        $project.targets `
        | Add-Member -MemberType NoteProperty -name "publish" -value @{
            "command"   = "node tools/scripts/publish.mjs dnd5e-application {args.ver} {args.tag}";
            "dependsOn" = @("build");
        } 
        $project | ConvertTo-Json -Depth 10 | set-content -path "$($wksp.application)/project.json"

        $package = get-content -path "$($wksp.application)/package.json" | convertfrom-json 
        $package `
        | Add-Member -MemberType NoteProperty -name "publishConfig" -value @{
            registry = $your_registry 
        }
        $package | ConvertTo-Json -Depth 10 | set-content -path "$($wksp.application)/package.json"
    
        set-content -path "$($wksp.application)/src/index.ts" -value @'
export * from './lib';
'@ 
        Remove-Item -Path "$($wksp.application)/src/lib/*" -Force -Recurse
    
        set-content -path "$($wksp.application)/src/lib/index.ts" -value @'
export * from './?';
'@
    }

    if (-not $wksp.apiIsDone) {
        yarn nx g @nx/react:library dnd5e-api --importPath=@boobafetes/dnd5e-api --publishable --minimal --style=scss --bundler=rollup --routing --pascalCaseFiles --e2eTestRunner=none --no-strict --no-interactive
        Stop-NX-Daemon
        $project = get-content -path "$($wksp.api)/project.json" | convertfrom-json 
        $project.targets.build.options `
        | Add-Member -MemberType NoteProperty -name "buildableProjectDepsInPackageJsonType" -value $true    
        $project.targets.build.options `
        | Add-Member -MemberType NoteProperty -name "updateBuildableProjectDepsInPackageJson" -value $true
        $project.targets `
        | Add-Member -MemberType NoteProperty -name "publish" -value @{
            "command"   = "node tools/scripts/publish.mjs dnd5e-api {args.ver} {args.tag}";
            "dependsOn" = @("build");
        } 
        $project | ConvertTo-Json -Depth 10 | set-content -path "$($wksp.api)/project.json"

        $package = get-content -path "$($wksp.api)/package.json" | convertfrom-json 
        $package `
        | Add-Member -MemberType NoteProperty -name "publishConfig" -value @{
            registry = $your_registry 
        }
        $package | ConvertTo-Json -Depth 10 | set-content -path "$($wksp.api)/package.json"

        set-content -path "$($wksp.api)/src/index.ts" -value @'
export * from './lib';
'@
        Remove-Item -Path "$($wksp.api)/src/lib/*" -Force -Recurse
        set-content -path "$($wksp.api)/src/lib/index.ts" -value @'
export * from './?';
'@ 
    }
    #endregion

    #region ajout des packages
    yarn add @apollo/client graphql @mui/material @emotion/react @emotion/styled @mui/icons-material
    #endregion
}
finally {
    set-location $scriptRoot
}