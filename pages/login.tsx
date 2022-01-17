import React from 'react'
import { getProviders, signIn } from 'next-auth/react'
import Image from 'next/image';

const Login = ({ providers }: any) => {

    return (
        <div className='flex flex-col items-center bg-black min-h-screen w-full justify-center'>
            <div>
                <Image width={52} height={52} layout='responsive'
                    src='https://links.papareact.com/9xl'
                    alt='' />
                {Object.values(providers).map((provider: any) => (
                    <div key={provider.name}>
                        <button className='bg-[rgb(24,216,96)] text-black p-5 mt-5 rounded-full'
                            onClick={() => signIn(provider.id, { callbackUrl: "/" })}>
                            Login with {provider.name}</button>
                    </div>

                ))}
            </div>
        </div >
    )
}

export default Login;


export async function getServerSideProps() {
    const providers = await getProviders();
    console.log("data in providers: ", providers);

    return {
        props: {
            providers,
        },
    };
}