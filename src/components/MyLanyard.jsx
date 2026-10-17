import { useEffect, useState } from 'react';

import Lanyard from './Lanyard';

// Below this width the lanyard isn't rendered at all, and the static headshot in the
// About section shows instead (see .about__card in css/main.css). Keep the two in sync.
const MOBILE_QUERY = '(max-width: 900px)';

// True when the screen is wider than MOBILE_QUERY. Updates on resize.
const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(() => !window.matchMedia(MOBILE_QUERY).matches);
  useEffect(() => {
    const media = window.matchMedia(MOBILE_QUERY);
    const onChange = () => setIsDesktop(!media.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);
  return isDesktop;
};

// The lanyard fills #my-lanyard, which is sized and placed by the #my-lanyard rule in css/main.css.
const MyLanyard = () => {
  const isDesktop = useIsDesktop();
  if (!isDesktop) return null;
  return (
    <Lanyard
      frontImage="assets/headshot.jpg"
      backImage="assets/headshot.jpg"
      imageFit="cover"
      cardColor="#ffffff"
      orientation="portrait"
      finish="metallic"
      cornerRadius={0.3}
      size={0.47}
      anchor="right"
      strapLength={0.5}
      strapColor="#2a2f3a"
      strapWidth={0.65}
      metal="silver"
      gravity={1.7}
      damping={0.5}
      elasticity={0.5}
      breeze={0.5}
      interactive
      intro
    />
  );
};

export default MyLanyard;
