import Nookies from "nookies";
import { useEffect, useState } from "react";

export default function Vibes() {
  useEffect(() => {
    const fetchPlaylists = async () => {
      const data = await fetch("https://api.spotify.com/v1/me/playlists", {
        method: "GET",
        headers: new Headers({
          Authorization: `Bearer ${Nookies.get().access_token}`,
        }),
      });

      const json = await data.json();
      setPlayLists(json.items);
    };

    const result = fetchPlaylists().catch((err) => console.error(err));
  });

  const [playLists, setPlayLists] = useState();

  return (
    <>
      <h1>Select your music!</h1>
    </>
  );
}
