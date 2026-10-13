import React, { useState } from 'react';
import { TutorChat, newThread } from '../components/Tutor.jsx';
import { useCourse } from '../lib/course.js';

// Kept outside the component so the chat survives switching tabs.
let saved = { id: newThread(), messages: [] };

const TEXT = {
  gcse: {
    blurb: "Ask about any topic, or show a question you've tried and what you got. Your parent can see these chats and gets an alert if you seem upset.",
    intro: "Hi! What are you working on? If it's a question, tell me what you tried first and I'll help from there.",
    chips: ['How do I remember spellings?', 'What does an RCD do?', 'What maths do electricians use?'],
  },
  repair: {
    blurb: 'Ask about any repair topic, or describe a board, its symptoms and your readings.',
    intro: 'What are you working on? Give me the device, the symptom and any readings you have.',
    chips: ['Laptop: 20 V in, no 3V/5V always-on. Where next?', 'How do I read a boardview?', 'Best hot air settings for 0402 parts?'],
  },
};

export default function Help() {
  const course = useCourse();
  const text = TEXT[course.id] ?? TEXT.gcse;
  const [, force] = useState(0);
  const setMessages = fn => { saved.messages = typeof fn === 'function' ? fn(saved.messages) : fn; force(x => x + 1); };
  return (
    <main className="page" style={{ paddingBottom: 0, minHeight: 'calc(100dvh - var(--tabh))', gap: 8 }}>
      <div className="row"><div className="stack" style={{ gap: 2 }}><span className="eyebrow">Tutor</span><h1>Ask anything</h1></div>
        <span className="spacer" />{saved.messages.length > 0 && <button className="btn small ghost" onClick={() => { saved = { id: newThread(), messages: [] }; force(x => x + 1); }}>New chat</button>}</div>
      <p className="muted small">{text.blurb}</p>
      <div className="card" style={{ padding: 0, flex: 1, minHeight: 360, marginBottom: 'calc(var(--tabh) + env(safe-area-inset-bottom,0px) + 16px)', overflow: 'hidden' }}>
        <TutorChat threadId={saved.id} messages={saved.messages} setMessages={setMessages}
          intro={text.intro} chips={text.chips} />
      </div>
    </main>
  );
}
