"use client";

import { useEffect } from "react";

interface Props {
  videoKey: string;
  title: string;
}

export function TrailerEmbed({ videoKey, title }: Props) {
  useEffect(() => {
    // Dynamically import so the web component registers after hydration
    import("lite-youtube-embed");
  }, []);

  return (
    <div className="overflow-hidden rounded-lg">
      <lite-youtube
        videoid={videoKey}
        playlabel={`Play trailer — ${title}`}
        style={{ backgroundImage: `url(https://i.ytimg.com/vi/${videoKey}/hqdefault.jpg)` }}
      />
    </div>
  );
}
