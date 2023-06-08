import { Menu as MenuIcon } from '@mui/icons-material';
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import { FC, MouseEvent, memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import titleImg from './title.jpg';

interface IPage {
  to: string;
  label: string;
  sub?: IPage[];
}
interface IResponsiveAppBarProps {
  pages?: IPage[];
}
export const ResponsiveAppBar: FC<IResponsiveAppBarProps> = memo(
  ({ pages }) => {
    const navigate = useNavigate();
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
      setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
      setAnchorElNav(null);
    };

    return (
      <AppBar position="static">
        <Box sx={{ marginLeft: 1, marginRight: 1 }}>
          <Toolbar disableGutters>
            <img
              width="150"
              alt="logo de Dungeons and Dragons"
              src={titleImg}
            />
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {pages?.map((page, index) => (
                  <MenuItem
                    key={index}
                    onClick={() => {
                      handleCloseNavMenu();
                      navigate(page.to);
                    }}
                  >
                    <Typography textAlign="center">{page.label}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Typography
              variant="h5"
              noWrap
              component="a"
              href=""
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Dungeons & Dragons 5
            </Typography>
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: 'none', md: 'flex' },
                marginLeft: 1,
              }}
            >
              {pages.map((page, index) => (
                <Button
                  key={index}
                  onClick={() => {
                    handleCloseNavMenu();
                    navigate(page.to);
                  }}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  {page.label}
                </Button>
              ))}
            </Box>
          </Toolbar>
        </Box>
      </AppBar>
    );
  }
);
