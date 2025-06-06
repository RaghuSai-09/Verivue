import Image from 'next/image'
import React from 'react'
import { cn } from '@/lib/utils';

enum callStatus {
    INACTIVE = 'INACTIVE',
    ACTIVE = 'ACTIVE',
    CONNECTING = 'CONNECTING',
    FINISHED = 'FINISHED',
}

const Agent = ( { userName }: AgentProps ) => {
    const messages = [
        'Whats your name?',
        'My name is John Doe, nice to meet you!',
    ];
    const postMessage = messages[messages.length - 1];
    const isSpeaking = true; 
  return (
    <>
        <div className="call-view">
            <div className="card-interviewer">
                <div className="avatar">
                    <Image src ="/robot12.png" alt="VAPI AI Agent" width={100} height={100} className="object-cover" />
                    {isSpeaking && <span className="animate-speak"/>}
                </div>
                <h3> AI Interviewer</h3>
            </div>
            <div className="card-border">
                <div className="card-content">
                    <Image src='/user-avatar.png' alt='User Avatar' width={540} height={540} className='size-[120px] object-cover rounded-full' />
                    <h3>{ userName }</h3>
                </div>
            </div>
        </div>

        {messages.length > 0 && (
            <div className="transcript-border">
                <div className="transcript">
                    <p key={postMessage} className={cn('transition-opacity duration-500 opacity-0', 'animate-fadeIn opacity-100')}>
                        {postMessage}
                    </p>
                </div>
            </div>
        )}

        <div className="w-full flex justify-center">
            {callStatus.ACTIVE !== 'ACTIVE' ? (
                <button className='relative btn-call'>
                    <span className={cn('absolute animate-ping rounded-full opacity-75', callStatus.CONNECTING !== 'CONNECTING' ? 'hidden' : '')}/>
                    <span>
                        {callStatus.INACTIVE === 'INACTIVE' || callStatus.FINISHED === 'FINISHED' ? 'Call' : 'Connecting...'}
                    </span>
                </button>
            ): (
                <button className="btn-disconnect">
                    End Call
                </button>
            )}
        </div>
    </>
  )
}

export default Agent