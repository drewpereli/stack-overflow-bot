'use client';

import { useState } from 'react';
import Ask from './Ask';
import Answer from './Answer';

export default function Chat() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!submitted) {
    return (
      <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
        <Ask 
          title={title}
          content={content}
          setTitle={setTitle}
          setContent={setContent}
          onSubmit={() => setSubmitted(true)}
        />
      </div>
    );
  } else {
    return <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      <Answer
        title={title}
        content={content}
      />
    </div>
  }
}