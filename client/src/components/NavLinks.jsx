import { Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { NavLink } from "react-router-dom";
import useRootStyles from "../theme/useRootStyles";
import Links from "./Links";

function NavLinks({ setToggled }) {
  const menuTheme = {
    menuDarkBg: "#4A5568",
    menuHoverDarkBg: "#1A202C !important",
  };

  const rootStyle = useRootStyles();
  const menuRootStyle = useRootStyles(menuTheme);

  return (
    <Menu>
      {Links.map((link) => {
        const { text, submenu, icon } = link;
        return (
          <SubMenu key={text} label={text} icon={icon} rootStyles={rootStyle}>
            {submenu.map((item) => {
              const { subText, subPath } = item;
              return (
                <MenuItem
                  key={subText}
                  component={<NavLink to={subPath} end />}
                  rootStyles={menuRootStyle}
                  onClick={() => setToggled(false)}
                >
                  {subText}
                </MenuItem>
              );
            })}
          </SubMenu>
        );
      })}
    </Menu>
  );
}
export default NavLinks;
