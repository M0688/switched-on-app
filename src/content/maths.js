/* Maths Week 1 sessions (ported from the study pages). */
const r=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pick=a=>a[r(0,a.length-1)];
const term=(c,v)=>c===1?v:c+v;
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=r(0,i);[a[i],a[j]]=[a[j],a[i]]}return a};

const S=[
{id:'s1',title:'What 3x means',sub:'Substituting numbers into algebra',
lesson:`<p>In algebra, a letter stands for a number. When a number sits right next to a letter, it means <b>multiply</b>.</p>
<ul><li><b>3x</b> means 3 × x</li><li><b>x²</b> means x × x</li><li><b>4(x + 2)</b> means 4 × (x + 2). Do the bracket first.</li></ul>
<p>"Substitute" means swap the letter for its number, then work it out. Multiply before you add or subtract.</p>
<div class="work"><span class="eyebrow">Worked example</span><div>If x = 5, work out 3x − 2</div><div>3x = 3 × 5 = 15</div><div>15 − 2 = <b>13</b></div></div>
<p class="slip">Common slip: if x = 5, then 3x is 15, not 35.</p>`,
gen(){const x=r(2,9),t=r(0,6);let e,a,s;
 switch(t){
 case 0:{const m=r(2,9);e=`${m}x`;a=m*x;s=`${m}x = ${m} × ${x} = ${a}`;break}
 case 1:{const m=r(2,9),c=r(1,12);e=`${m}x + ${c}`;a=m*x+c;s=`${m} × ${x} = ${m*x}, then ${m*x} + ${c} = ${a}`;break}
 case 2:{const m=r(2,9),c=r(1,m*x-1);e=`${m}x − ${c}`;a=m*x-c;s=`${m} × ${x} = ${m*x}, then ${m*x} − ${c} = ${a}`;break}
 case 3:{e='x²';a=x*x;s=`x² = ${x} × ${x} = ${a}`;break}
 case 4:{const c=r(1,9),m=r(2,5);e=`${m}(x + ${c})`;a=m*(x+c);s=`Bracket first: ${x} + ${c} = ${x+c}, then ${m} × ${x+c} = ${a}`;break}
 case 5:{const m=r(2,4),c=r(m*x+1,m*x+15);e=`${c} − ${m}x`;a=c-m*x;s=`${m} × ${x} = ${m*x}, then ${c} − ${m*x} = ${a}`;break}
 case 6:{const y=r(2,9),m=r(2,5),n=r(2,5);return{q:`If x = ${x} and y = ${y}, work out ${m}x + ${n}y`,a:m*x+n*y,s:`${m} × ${x} = ${m*x} and ${n} × ${y} = ${n*y}. ${m*x} + ${n*y} = ${m*x+n*y}`}}
 }
 return{q:`If x = ${x}, work out ${e}`,a,s}}},

{id:'s2',title:'Collecting like terms',sub:'Simplifying expressions',
lesson:`<p><b>Like terms</b> have the same letter. You can add or take away like terms, but you cannot mix different letters.</p>
<p>Think of <b>a</b> as apples and <b>b</b> as bananas. Count the apples, then count the bananas.</p>
<ul><li>A letter on its own means 1 of it: <b>a</b> = 1a</li><li>The sign in front of a term belongs to it: <b>− a</b> means take one a away</li></ul>
<div class="work"><span class="eyebrow">Worked example</span><div>Simplify 4a + 3b − a + 2b</div><div>a terms: 4a − a = 3a</div><div>b terms: 3b + 2b = 5b</div><div>Answer: <b>3a + 5b</b></div></div>
<p class="slip">Common slip: 3a + 5b cannot be squashed into 8ab. Different letters stay separate.</p>`,
gen(){const [u,v]=pick([['a','b'],['x','y'],['m','n'],['p','q']]);
 const f=(A,B)=>`${term(A,u)} + ${term(B,v)}`;let expr,A,B,s,w;
 if(Math.random()<.5){const p=r(3,8),k=r(1,p-1),q=r(1,6),t=r(1,6);
  expr=`${term(p,u)} + ${term(q,v)} − ${term(k,u)} + ${term(t,v)}`;A=p-k;B=q+t;
  s=`${u} terms: ${p} − ${k} = ${A}. ${v} terms: ${q} + ${t} = ${B}.`;
  w=[f(p+k,B),f(A,q>t?q-t:B+2),`${A+B}${u}${v}`,`${A+B}${u}`];
 }else{const p=r(1,6),k=r(1,6),q=r(3,8),t=r(1,q-1);
  expr=`${term(p,u)} + ${term(q,v)} + ${term(k,u)} − ${term(t,v)}`;A=p+k;B=q-t;
  s=`${u} terms: ${p} + ${k} = ${A}. ${v} terms: ${q} − ${t} = ${B}.`;
  w=[f(A,q+t),f(p===k?A+1:Math.abs(p-k),B),`${A+B}${u}${v}`,`${A+B}${v}`];}
 const c=f(A,B);const o=[c];for(const x of w)if(!o.includes(x)&&o.length<4)o.push(x);
 while(o.length<4){const x=f(A+o.length,B);if(!o.includes(x))o.push(x)}
 shuffle(o);return{mc:true,q:`Simplify ${expr}`,o,a:o.indexOf(c),s:s+` Answer: ${c}`}}},

{id:'s3',title:'Using formulas',sub:'Ohm’s law and power, the maths electricians use daily',
lesson:`<p>A formula is a rule written with letters. Substitute the numbers you know, then calculate. These two come up constantly on the electrical course:</p>
<ul><li><b>V = I × R</b> (Ohm's law). V is voltage in volts (V), I is current in amps (A), R is resistance in ohms (Ω).</li>
<li><b>P = V × I</b>. P is power in watts (W).</li>
<li>Turned round: <b>I = V ÷ R</b> and <b>I = P ÷ V</b>.</li></ul>
<div class="work"><span class="eyebrow">Worked example</span><div>I = 3 A and R = 4 Ω. Find V.</div><div>V = I × R</div><div>V = 3 × 4 = <b>12 V</b></div></div>
<div class="work"><span class="eyebrow">Worked example</span><div>A 2300 W kettle runs on 230 V. Find the current.</div><div>I = P ÷ V</div><div>I = 2300 ÷ 230 = <b>10 A</b></div></div>`,
gen(){const t=r(0,3);
 if(t===0){const I=r(2,12),R=r(2,20);return{q:`A current of ${I} A flows through a resistance of ${R} Ω. Use V = I × R to find the voltage.`,a:I*R,u:'V',s:`V = ${I} × ${R} = ${I*R} V`}}
 if(t===1){const V=pick([12,24,230]),I=r(2,10);return{q:`A device runs on ${V} V and draws ${I} A. Use P = V × I to find the power.`,a:V*I,u:'W',s:`P = ${V} × ${I} = ${V*I} W`}}
 if(t===2){const R=r(2,12),I=r(2,10),V=I*R;return{q:`${V} V is across a resistance of ${R} Ω. Use I = V ÷ R to find the current.`,a:I,u:'A',s:`I = ${V} ÷ ${R} = ${I} A`}}
 const I=r(2,13),P=230*I;return{q:`A ${P} W heater runs on 230 V. Use I = P ÷ V to find the current.`,a:I,u:'A',s:`I = ${P} ÷ 230 = ${I} A`}}},

{id:'s4',title:'Sharing in a ratio',sub:'Splitting an amount into parts',
lesson:`<p>A ratio like <b>2 : 3</b> means for every 2 parts one side gets, the other gets 3. Three steps:</p>
<ul><li>Add the parts together</li><li>Divide the total by that to find one part</li><li>Multiply each side's number by one part</li></ul>
<div class="work"><span class="eyebrow">Worked example</span><div>Share £45 in the ratio 2 : 3</div><div>Parts: 2 + 3 = 5</div><div>One part: £45 ÷ 5 = £9</div><div>2 × £9 = £18 and 3 × £9 = £27</div><div>Check: £18 + £27 = £45 ✓ Answer: <b>£18 and £27</b></div></div>`,
gen(){let a=r(1,5),b=r(1,6);while(b===a)b=r(1,6);const k=r(2,12),T=k*(a+b);
 const big=Math.random()<.5;const want=big?Math.max(a,b):Math.min(a,b);
 if(Math.random()<.5){const who=want===a?'Sam':'Ali';
  return{q:`Share £${T} between Sam and Ali in the ratio ${a} : ${b}. How much does ${who} get?`,a:want*k,u:'£',pre:true,s:`Parts: ${a} + ${b} = ${a+b}. One part: ${T} ÷ ${a+b} = ${k}. ${who}: ${want} × ${k} = £${want*k}`}}
 return{q:`A ${T} m cable is cut into two pieces in the ratio ${a} : ${b}. How long is the ${big?'longer':'shorter'} piece?`,a:want*k,u:'m',s:`Parts: ${a} + ${b} = ${a+b}. One part: ${T} ÷ ${a+b} = ${k} m. ${want} × ${k} = ${want*k} m`}}},

{id:'s5',title:'The mean',sub:'Finding an average',
lesson:`<p>The <b>mean</b> is the most common kind of average. Two steps:</p>
<ul><li>Add all the numbers to get the total</li><li>Divide the total by how many numbers there are</li></ul>
<div class="work"><span class="eyebrow">Worked example</span><div>Find the mean of 4, 7, 9, 12, 8</div><div>Total: 4 + 7 + 9 + 12 + 8 = 40</div><div>How many: 5 numbers</div><div>40 ÷ 5 = <b>8</b></div></div>
<p class="slip">Count the numbers carefully. Dividing by the wrong count is the usual mistake.</p>`,
gen(){for(;;){const n=r(4,6),m=r(4,14),xs=[];let sum=0;
 for(let i=0;i<n-1;i++){const v=r(Math.max(1,m-6),m+6);xs.push(v);sum+=v}
 const last=n*m-sum;if(last>=1&&last<=30){xs.push(last);
  const ctx=pick(['Find the mean of','An apprentice worked these hours each day. Find the mean:','Cable offcuts in metres. Find the mean length:']);
  return{q:`${ctx} ${xs.join(', ')}`,a:m,s:`Total: ${xs.join(' + ')} = ${n*m}. There are ${n} numbers. ${n*m} ÷ ${n} = ${m}`}}}}},

{id:'s6',title:'Subtraction with borrowing',sub:'Column method, plus checking',
lesson:`<p>A common slip is 305 − 128 = 183. That's a borrowing mistake. When the top digit is smaller, borrow from the column to the left. If that column is 0, borrow from the next one along first.</p>
<div class="work"><span class="eyebrow">Worked example: 305 − 128</span><div>Units: 5 − 8 won't go. Tens is 0, so borrow from the hundreds.</div><div>Hundreds 3 → 2. Tens 0 → 10, then lend 1 to units: tens 9, units 15.</div><div>Units: 15 − 8 = 7. Tens: 9 − 2 = 7. Hundreds: 2 − 1 = 1.</div><div>Answer: <b>177</b></div></div>
<p class="slip">Always check by adding back: 177 + 128 = 305 ✓</p>`,
gen(){for(;;){let a=r(201,999);if(Math.random()<.4)a=r(2,9)*100+r(0,8);const b=r(101,a-10);
 if(a%10<b%10)return{q:`Work out ${a} − ${b}`,a:a-b,s:`${a} − ${b} = ${a-b}. Check: ${a-b} + ${b} = ${a}`}}}}
];

export default S;
