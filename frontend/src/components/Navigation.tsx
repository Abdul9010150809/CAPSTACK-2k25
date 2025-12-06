import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu,
  Dashboard,
  Savings,
  Insights,
  AccountBalance,
  Assessment,
  PieChart,
  Shield
} from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Navigation = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: <Dashboard /> },
    { label: 'Assessment', href: '/assessment', icon: <Assessment /> },
    { label: 'Allocation', href: '/allocation', icon: <PieChart /> },
    { label: 'Emergency', href: '/emergency', icon: <Shield /> },
    { label: 'Savings', href: '/savings', icon: <Savings /> },
    { label: 'Insights', href: '/insights', icon: <Insights /> },
  ];

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const drawer = (
    <Box sx={{ width: 250 }}>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.href} disablePadding>
            <ListItemButton
              component={Link}
              href={item.href}
              selected={router.pathname === item.href}
              onClick={handleDrawerToggle}
            >
              <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                {item.icon}
              </Box>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" elevation={1} sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            href="/"
            sx={{
              flexGrow: 0,
              mr: 4,
              textDecoration: 'none',
              color: 'primary.main',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <AccountBalance />
            CapStack
          </Typography>

          {isMobile ? (
            <>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
              >
                <Menu />
              </IconButton>
            </>
          ) : (
            <>
              <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
                {navItems.map((item) => (
                  <Button
                    key={item.href}
                    component={Link}
                    href={item.href}
                    variant={router.pathname === item.href ? 'contained' : 'text'}
                    startIcon={item.icon}
                    sx={{
                      color: router.pathname === item.href ? 'primary.contrastText' : 'text.primary',
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
              <Button
                variant="outlined"
                startIcon={<Assessment />}
                component={Link}
                href="/onboarding"
              >
                Update Profile
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navigation;