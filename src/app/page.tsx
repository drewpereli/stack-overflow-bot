'use client';

import { useCompletion } from '@ai-sdk/react';
import { RESPONSE_TYPES, ResponseType } from './api/completion/route';
import { useEffect, useMemo, useState } from 'react';
import { shuffle, randomInt } from 'es-toolkit';

export default function Chat() {
  const responseTypes = useMemo(() => {
    const responseCount = randomInt(2, 5);
    return shuffle(RESPONSE_TYPES).slice(0, responseCount);
  }, []);

  const [currentResponseType, setCurrentResponseType] = useState<ResponseType>(responseTypes[0]);
  
  const { input, handleInputChange, completion, complete, isLoading } = useCompletion({
    body: {
      responseType: currentResponseType
    },
  });

  const [submitted, setSubmitted] = useState(false);
  const [done, setDone] = useState(false);

  const [responses, setResponses] = useState<{id: string; content: string}[]>([]);

  useEffect(() => {
    if (submitted && !isLoading && !done) {
      complete(input);

      // Add a new response to the responses array with a unique ID
      setResponses(prev => [...prev, { id: '' + Date.now(), content: '' }]);

      const responseTypeIdx = responseTypes.indexOf(currentResponseType);

      if (responseTypeIdx === responseTypes.length - 1) {
        setDone(true)
      } else {
        setCurrentResponseType(responseTypes[responseTypeIdx + 1]);
      }
    }
  }, [submitted, isLoading, done]);

  useEffect(() => {
    setResponses(prev => {
      const oldResponses = prev.slice(0, -1);
      const newResponse = prev[prev.length - 1];

      if (newResponse) {
        return [...oldResponses, { ...newResponse, content: completion }];
      }

      return prev;
    })
  }, [completion]);


  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      <form onSubmit={(e) => {e.preventDefault(); setSubmitted(true)}}>
        <textarea
          className="dark:bg-zinc-900 w-full max-w-md p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
          rows={10}
        />

        <button>Submit</button>
      </form>

      <div>
        {responses.map(message => <div key={message.id}>{message.content}</div>)}
      </div>
    </div>
  );
}