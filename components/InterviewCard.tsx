import dayjs from 'dayjs';
import Image from 'next/image';
import { getRandomInterviewCover } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import DisplayTechIcons from './DisplayTechIcons';

const InterviewCard = ({ interviewId, userId, role, type, techstack, createdAt} : InterviewCardProps) => {

  const feedback = null as Feedback | null;
  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;  // Normalize type to "Mixed" if it contains "mix"
  const formattedDate = dayjs(feedback?.createdAt ?? createdAt ?? Date.now()).format("MMM D, YYYY");


  return (
    <div className='card-border w-[360px] mx-sm:w-full min-h-96'>
      <div className="card-interview">
        <div>
          <div className="absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-light-600">
            <p className="badge-text">{normalizedType}</p>
          </div>
          <Image src={getRandomInterviewCover()} alt="Interview Cover" width={90} height={90} className='size-[90px] object-fit rounded-full' />
          <h3 className="capitalize mt-5" >
            {role} Interview
          </h3>
          <div className="flex flex-row gap-6 mt-3">
            <div className="flex flex-row gap-2">
              <Image src='/calendar.svg' alt='Calendar' width={22} height={22} />
              <p>{formattedDate}</p>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <Image src='/star.svg' alt='Star' width={22} height={22} />
              <p>{feedback?.totalScore ?? '---'}/100</p>
            </div>
          </div>
          <p className="line-clamp-2 mt-5">
            {feedback?.finalAssessment ?? "No feedback yet. Practice more to get better!"}  
          </p>
        </div>
        <div className="flex flex-row justify-between">
          <DisplayTechIcons techStack={techstack} />


          <Button className="btn-primary">
            <Link href={feedback
              ? `/interview/${interviewId}/feedback`
              : `/interview/${interviewId}`
            }>
              {feedback ? 'View Feedback' : 'Start Interview'}
            </Link>
          </Button>
        </div>
      </div>

    </div>
  )
}

export default InterviewCard;