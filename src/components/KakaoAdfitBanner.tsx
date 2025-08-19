import { useEffect, useRef } from "react";

export const KakaoAdfitBanner = () => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adRef.current) return;

    const ins = document.createElement("ins");
    ins.className = "kakao_ad_area";
    ins.style.display = "none";
    ins.setAttribute("data-ad-unit", "DAN-cPtgQUzvuDBVhnSf");
    ins.setAttribute("data-ad-width", "728");
    ins.setAttribute("data-ad-height", "90");

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "//t1.daumcdn.net/kas/static/ba.min.js";
    script.async = true;

    adRef.current.appendChild(ins);
    adRef.current.appendChild(script);

    return () => {
      script.remove();
      ins.remove();
    };
  }, []);

  return (
    <div
      ref={adRef}
      className="flex justify-center items-center w-full mt-20"
    />
  );
};
