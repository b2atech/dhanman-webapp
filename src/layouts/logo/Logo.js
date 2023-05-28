import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import React from 'react';
// import { ReactComponent as LogoDarkIcon } from '../../assets/images/logos/b2a-logo-dark.svg';
import { ReactComponent as LogoDarkText } from '../../assets/images/logos/b2a-logo-darktext.svg';
// import { ReactComponent as LogoWhiteIcon } from '../../assets/images/logos/b2a-logo-white.svg';
import { ReactComponent as LogoWhiteText } from '../../assets/images/logos/b2a-logo-whitetext.svg';

const Logo = () => {
  const isDarkMode = useSelector((state) => state.customizer.isDark);
  const toggleMiniSidebar = useSelector((state) => state.customizer.isMiniSidebar);
  const activeTopbarBg = useSelector((state) => state.customizer.topbarBg);
  return (
    <Link to="/" className="d-flex align-items-center gap-2">
      {isDarkMode || activeTopbarBg !== 'white' ? (
        <>
          {/* <LogoWhiteIcon /> */}
          {toggleMiniSidebar ? '' : <LogoWhiteText />}
        </>
      ) : (
        <>
          {/* <LogoDarkIcon /> */}
          {toggleMiniSidebar ? '' : <LogoDarkText />}
        </>
      )}
    </Link>
  );
};

export default Logo;
