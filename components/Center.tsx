import { LogoutIcon } from '@heroicons/react/outline';
import { signOut, useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { shuffle } from 'lodash';
import { useRecoilState } from 'recoil';
import { playlistIdState, playlistState } from '../atoms/playlistAtom';
import useSpotify from '../hooks/useSpotify';
import Songs from './Songs';

const colors = [
    'from-indigo-500',
    'from-blue-500',
    'from-green-500',
    'from-red-500',
    'from-yellow-500',
    'from-pink-500',
    'from-purple-500',
];

// interface IsessionShape {
//     user: any;
//     name: string;
//     image: string;
// }

const Center = () => {
    const { data: session } = useSession();
    const spotifyApi = useSpotify();
    const [color, setColor] = useState<any>(null);
    const [playlistId] = useRecoilState<string>(playlistIdState);
    const [playlist, setPlaylist] = useRecoilState<any>(playlistState);

    useEffect(() => setColor(shuffle(colors).pop()), [playlistId])
    console.log("Here is session data: ", session);

    useEffect(() => {
        spotifyApi.getPlaylist(playlistId).then((data: any) => {
            setPlaylist(data.body);
        })
            .catch((error) => console.log("Something went wrong", error)
            )
    }, [spotifyApi, playlistId])

    console.log(playlist);

    return (
        <div className='flex-grow h-screen overflow-y-scroll'>
            <header className='absolute top-5 right-8'>
                <div className="flex items-center relative bg-black space-x-3 opacity-90
                hover:opacity-80 cursor-pointer rounded-full p-1 pr-2"
                    onClick={() => signOut()}>
                    <img src={session?.user.image}
                        alt="userimage"
                        className='rounded-full w-10 h-10'
                    />
                    <h2 className='hidden md:inline text-gray-400 '>{session?.user.name}</h2>
                    <LogoutIcon className='h-7 w-6 text-gray-400 pr-1' />
                </div>
            </header>
            <section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} 
            h-80 text-white p-8 w-full`}>
                <img src={playlist?.images?.[0]?.url}
                    className='h-44 w-44 shadow-2xl'
                    alt="album cover" />
                <div>
                    <p>PLAYLIST</p>
                    <h1 className='text-2xl md:text-3xl xl:text-5xl'>
                        {playlist?.name}
                    </h1>
                </div>
            </section>
            <div>
                <Songs />
            </div>
        </div>
    )
}

export default Center
