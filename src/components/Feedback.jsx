import React from 'react';

export default function Feedback({ fb, parent }) {
  if (!fb) return null;
  return (
    <div className="fbk stack" style={{ gap: 10 }}>
      <div className="row"><b style={{ fontFamily: 'var(--display)', fontSize: '1.25rem' }}>{fb.grade_estimate}</b><span className="spacer" />
        <span className="pill quiet num">{fb.score_out_of_10}/10</span></div>
      <p>{fb.summary}</p>
      {fb.strengths?.length > 0 && <><h3>What went well</h3><ul>{fb.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul></>}
      {fb.targets?.length > 0 && <><h3>Next time</h3><ul>{fb.targets.map((s, i) => <li key={i}>{s}</li>)}</ul></>}
      {fb.corrections?.length > 0 && <><h3>Fixes</h3>
        {fb.corrections.map((c, i) => (
          <div key={i} className="corr"><span className="x" style={{ textDecoration: 'line-through' }}>{c.original}</span> → <span className="y">{c.corrected}</span>
            <br /><span className="muted small">{c.why}</span></div>
        ))}</>}
      {(fb.content_and_organisation || fb.technical_accuracy) && (
        <details><summary>Detailed marks</summary>
          <p className="small" style={{ marginTop: 6 }}><b>Ideas and organisation:</b> {fb.content_and_organisation}</p>
          <p className="small" style={{ marginTop: 6 }}><b>Accuracy:</b> {fb.technical_accuracy}</p></details>
      )}
      {parent && fb.parent_note && <div className="note"><b>For you:</b> {fb.parent_note}</div>}
    </div>
  );
}
