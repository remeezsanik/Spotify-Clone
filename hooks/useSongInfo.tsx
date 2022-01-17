import useSpotify from "./useSpotify"
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';
import { useRecoilState } from "recoil";
import { useEffect, useState } from "react";
import { Url } from "url";


interface IsongInfoShape {
    album: string;
    artists: string[];
    name: string;
    images: any[];
    url: string;
}

function useSongInfo(): IsongInfoShape | null {
    const spotifyApi = useSpotify();
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const [songInfo, setSongInfo] = useState<IsongInfoShape | null>(null);

    useEffect(() => {
        const fetchSongInfo = async () => {
            if (currentTrackId) {
                const trackInfo = await fetch(`https://api.spotify.com/v1/tracks/${currentTrackId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${spotifyApi.getAccessToken()}`
                        }
                    }).then((res) => res.json());

                setSongInfo(trackInfo);
            }
        }
        fetchSongInfo();
    }, [currentTrackId, spotifyApi])

    return songInfo;
}

export default useSongInfo
