// material-ui
import { useTheme } from '@mui/material/styles';

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoIconDark from 'assets/images/logo-icon-dark.svg';
 * import logoIcon from 'assets/images/logo-icon.svg';
 * import { ThemeMode } from 'types/config';
 *
 */

// ==============================|| LOGO ICON SVG ||============================== //

const LogoIcon = () => {
  const theme = useTheme();

  return (
    /**
     * if you want to use image instead of svg uncomment following, and comment out <svg> element.
     *
     * <img src={theme.palette.mode === ThemeMode.DARK ? logoIconDark : logoIcon} alt="Mantis" width="100" />
     *
     */
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000">
      <g>
        <g transform="translate(0.000000,460.000000) scale(0.100000,-0.100000)">
          <path
            d="M8489.9,3855.2c-683-67-1260.9-120.5-1281.9-122.5c-26.8,0,80.4-118.6,369.3-407.5l405.6-405.6L6911.4,1848.1L5839.9,776.7L5030.6,1586l-807.4,807.4L2160.6,330.9L100-1729.8l424.8-426.7l426.7-424.8L2581.6-951L4213.6,681l809.3-809.3l807.4-807.4l1502,1501.9l1502,1502l396.1-396.1c258.3-258.3,399.9-386.5,405.6-367.3c3.8,13.4,61.2,587.4,126.3,1270.4c63.1,685,120.5,1280,126.3,1325.9l11.5,80.4l-82.3-1.9C9771.8,3977.7,9174.8,3922.2,8489.9,3855.2z"
            fill={theme.palette.primary.dark}
          />
          <path d="M8254.5,665.7l-597-597v-2426.1v-2424.2h602.7H8863v3023c0,1662.7-1.9,3023-5.7,3023C8855.3,1264.6,8583.7,994.8,8254.5,665.7z" />
          <path d="M4328.4-2520v-2261.5h602.7h602.7v1660.8v1658.8l-602.7,602.7l-602.7,602.7V-2520z" />
          <path d="M6590-998.9l-597-597v-1593.8v-1591.9h602.7h602.7v2190.8c0,1205.4-1.9,2190.7-5.7,2190.7C7190.7-400,6919.1-669.8,6590-998.9z" />
          <path d="M3260.8-1094.5l-597-597v-1545.9v-1544.1h602.7h602.7v2142.9c0,1178.6-1.9,2142.9-5.7,2142.9C3861.6-495.7,3589.9-765.4,3260.8-1094.5z" />
          <path d="M1596.2-2759.1l-597-597v-713.7v-711.8H1602h602.7v1310.6c0,721.3-1.9,1310.6-5.7,1310.6C2197-2160.2,1925.3-2430,1596.2-2759.1z" />
        </g>
      </g>
    </svg>
  );
};

export default LogoIcon;
