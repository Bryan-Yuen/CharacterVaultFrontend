import React, { useRef, useEffect } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import Player from "video.js/dist/types/player";
// videojs styling in globals.css

// Define the props interface
interface VideoJSProps {
  options: any;
  onReady?: (player: Player) => void; // Optional onReady callback
}

// videojs styling in globals.css
export const VideoJS: React.FC<VideoJSProps> = ({ options, onReady }) => {
  const videoRef = useRef<HTMLDivElement | null>(null); // Ref for the div wrapping the video element
  const playerRef = useRef<Player | null>(null); // Ref for the Video.js player instance

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current && videoRef.current) {
      const videoElement = document.createElement("video-js");

      videoElement.classList.add('vjs-big-play-centered');
      videoRef.current.appendChild(videoElement);

      // Initialize the Video.js player
      const player = videojs(videoElement, options, () => {
        videojs.log('player is ready');
        if (onReady) {
          onReady(player);
        }
      });

      // Assign the player to the ref
      playerRef.current = player;

    } else if (playerRef.current) {
      // Update the existing player if necessary
      const player = playerRef.current;
      player.autoplay(options.autoplay);
      player.src(options.sources);
    }
  }, [options, onReady]);

  // Dispose the Video.js player when the component unmounts
  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div data-vjs-player>
      <div ref={videoRef} />
    </div>
  );
}

export default VideoJS;
