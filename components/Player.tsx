import { useSession } from "next-auth/react";
import useSpotify from "../hooks/useSpotify"
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';
import { useRecoilState } from "recoil";
import { useCallback, useEffect, useState } from "react";
import useSongInfo from "../hooks/useSongInfo";
import { HeartIcon, VolumeUpIcon as VolumeDownIcon } from "@heroicons/react/outline";
import {
    RewindIcon, FastForwardIcon,
    PauseIcon, PlayIcon, ReplyIcon,
    VolumeUpIcon, SwitchHorizontalIcon
} from "@heroicons/react/solid";
import { debounce } from "lodash";


function Player() {
    const spotifyApi = useSpotify();
    const { data: session } = useSession();
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const [isPlaying, setIsPlaying] = useRecoilState<boolean>(isPlayingState);
    const [volume, setVolume] = useState(50);
    const songInfo = useSongInfo();
    console.log("Song details>>>> ", songInfo);


    const fetchCurrentSong = () => {
        if (!songInfo) {
            spotifyApi.getMyCurrentPlayingTrack().then((data: any) => {
                setCurrentTrackId(data.body?.item?.id);

                spotifyApi.getMyCurrentPlaybackState().then((data) => {
                    setIsPlaying(data.body?.is_playing);
                })
            })
        }
    }

    const handlePlayPause = () => {
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
            if (data.body?.is_playing) {
                spotifyApi.pause();
                setIsPlaying(false);
            } else {
                spotifyApi.play();
                setIsPlaying(true);
            }
        });
    };


    useEffect(() => {
        if (spotifyApi.getAccessToken() && !currentTrackId) {
            fetchCurrentSong();
            setVolume(50);
        }
    }, [currentTrackId, spotifyApi, session]);

    useEffect(() => {
        if (volume > 0 && volume < 100) {
            deboucedAdjustVolume(volume);
        }
    }, [volume]);

    const deboucedAdjustVolume = useCallback(
        debounce((volume) => {
            spotifyApi.setVolume(volume).catch((err) => { })
        }, 500), []);

    return (
        <div className=" h-24 bg-gradient-to-b from-black to-gray-900 
        text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
            {/* left side */}
            <div className="flex items-center space-x-4">
                <img
                    src={songInfo?.album.images[0]?.url}
                    alt=""
                    className="hidden md:inline h-10 w-10" />
                <div className="text-xs md:text-base">
                    <h3>{songInfo?.name}</h3>
                    <p>{songInfo?.artists[0]?.name}</p>
                </div>
            </div>
            {/* Center */}
            <div className="flex items-center justify-evenly space-x-2">
                <SwitchHorizontalIcon className="button"
                    onClick={() => spotifyApi.setShuffle(false)}
                />
                <RewindIcon className="button"
                    onClick={() => spotifyApi.skipToPrevious()}
                />
                {isPlaying ? (
                    <PauseIcon onClick={handlePlayPause} className="button h-10 w-10" />
                ) : (
                    <PlayIcon onClick={handlePlayPause} className="button h-10 w-10" />
                )}
                <FastForwardIcon className="button"
                    onClick={() => spotifyApi.skipToNext()}
                />
                <ReplyIcon className="button"
                    onClick={() => spotifyApi.setRepeat('context')}
                />
            </div>
            {/* right side */}
            <div className="flex items-center space-x-3 md:space-x-4 justify-end p-5" >
                <VolumeDownIcon className="button md:inline" onClick={() => volume > 0 && setVolume(volume - 10)} />
                <input className="w-14 md:w-28"
                    type="range" value={volume} min={0} max={100}
                    onChange={(e) => setVolume(Number(e.target.value))} />
                <VolumeUpIcon className="button md:inline" onClick={() => volume < 100 && setVolume(volume + 10)} />
            </div>
        </div>
    )
}

export default Player
