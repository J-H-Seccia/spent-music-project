import React from 'react';
import { PiSoundcloudLogoFill } from "react-icons/pi";
import { AiFillTikTok } from "react-icons/ai";
import { FaXTwitter } from "react-icons/fa6";
import { FaSpotify } from "react-icons/fa";

const iconStyle = {
  position: 'absolute',
  fontSize: '4rem',
  color: 'white',
  transition: 'transform 0.3s ease, color 0.3s ease',
  cursor: 'pointer',
};

const hoverStyle = {
  transform: 'scale(1.2)',
  color: '#4CAF50',
};

const SocialMediaIcons = () => {
  const [hoveredIcon, setHoveredIcon] = React.useState(null);

  const icons = [
    { Icon: PiSoundcloudLogoFill, link: 'https://www.soundcloud.com/spent2muchh', position: { top: '20px', left: '20px' } },
    { Icon: AiFillTikTok, link: 'https://www.tiktok.com/@spenttwomuch', position: { top: '20px', right: '20px' } },
    { Icon: FaXTwitter, link: '#', position: { bottom: '20px', left: '20px' } },
    { Icon: FaSpotify, link: '#', position: { bottom: '20px', right: '20px' } },
  ];

  return (
    <>
      {icons.map(({ Icon, link, position }, index) => (
        <a
          key={index}
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            ...iconStyle,
            ...position,
            ...(hoveredIcon === index ? hoverStyle : {}),
          }}
          onMouseEnter={() => setHoveredIcon(index)}
          onMouseLeave={() => setHoveredIcon(null)}
        >
          <Icon />
        </a>
      ))}
    </>
  );
};

export default SocialMediaIcons;