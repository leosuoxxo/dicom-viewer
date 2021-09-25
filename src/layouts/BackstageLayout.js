import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
} from '@material-ui/core';
import { CloudDownload } from '@material-ui/icons';
import { backstageMenus } from '../config/menu';
import { useFirebaseAuthService } from '../services/firebaseAuthService';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
  title: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
    minHeight: '100vh',
  },
}));

export default function BackstageLayout({ children }) {
  const classes = useStyles();
  const { signOut } = useFirebaseAuthService();

  const downloadApp = () => {
    window.open(
      'https://storage.googleapis.com/dicom-viewer-dac76.appspot.com/artifacts/dist/dicom-viewer%20Setup%200.1.0.exe'
    );
  };

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar className={classes.title}>
          <Typography variant="h6" noWrap>
            dicom-viewer 後台管理系統
          </Typography>
          <Button color="inherit" onClick={signOut}>
            登出
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >
        <div className={classes.toolbar} />
        <Divider />
        <List>
          {backstageMenus.map((menu) => (
            <ListItem button key={menu.path}>
              <ListItemIcon>
                <menu.icon />
              </ListItemIcon>
              <ListItemText primary={menu.label} />
            </ListItem>
          ))}
          <Divider />
          <ListItem button onClick={downloadApp}>
            <ListItemIcon>
              <CloudDownload />
            </ListItemIcon>
            <ListItemText primary="下載" />
          </ListItem>
        </List>
        <Divider />
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {children}
      </main>
    </div>
  );
}

BackstageLayout.propTypes = {
  children: PropTypes.node,
};
