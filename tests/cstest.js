const {CS}=require('./load.js');
const logs=[];const G={Debug:{Log:(...a)=>logs.push(a.map(x=>CS.str(x)).join(' '))},Mathf:{Max:Math.max,Abs:Math.abs},Vector3:function(x,y,z){return {x,y,z}},Time:{deltaTime:0.1}};
G.Vector3.zero={x:0,y:0,z:0};
const T=(name,src,fn,check)=>{try{const r=CS.load(src,G);const v=fn(r);const ok=check(v);console.log(ok?'✓':'✗',name,ok?'':JSON.stringify(v))}catch(e){console.log('✗',name,'THROW',e.name,e.line,e.message)}};
T('dict+interp',`
using System.Collections.Generic;
public class A : MonoBehaviour {
 Dictionary<string,int> d = new Dictionary<string,int>();
 public string Run(){ d["a"]=1; d.Add("b",2); if(d.TryGetValue("b", out int v)) d["a"]+=v; string s=""; foreach(var kv in d) s += $"{kv.Key}={kv.Value:F1};"; return s; }
}`,r=>r.fns.Run(),v=>v==='a=3.0;b=2.0;');
T('struct copy',`
public class A { public Vector3 p; public float Run(){ Vector3 a = new Vector3(1,2,3); Vector3 b = a; b.x = 9; return a.x + b.x; } }`,r=>r.fns.Run(),v=>v===10);
T('inheritance virtual',`
class Animal { public virtual string Speak() => "..."; }
class Dog : Animal { public override string Speak() { return "Woof"; } }
public class Main : MonoBehaviour { public string Run(){ Animal a = new Dog(); return a.Speak(); } }`,r=>r.fns.Run(),v=>v==='Woof');
T('static counter',`
public class Main : MonoBehaviour { public static int count; public int Run(){ count++; count++; return count; } }`,r=>r.fns.Run(),v=>v===2);
T('int div',`int Run(){ int a=7; int b=2; float c = a / b; return (int)(c*10); }`,r=>r.fns.Run(),v=>v===30);
T('prop backing',`
private int hp=5;
public int Hp { get { return hp; } set { hp = Mathf.Max(0, value); } }
int Run(){ Hp = -3; return Hp; }`,r=>r.fns.Run(),v=>v===0);
T('lambda closure + List',`
using System.Collections.Generic;
int Run(){ var xs = new List<int>{5,1,4}; int k=2; xs.RemoveAll(x => x < k); xs.Sort(); return xs[0]*10+xs.Count; }`,r=>r.fns.Run(),v=>v===42);
T('switch string',`string Run(string s){ switch(s){ case "a": return "A"; case "b": case "c": return "BC"; default: return "?"; } }`,r=>r.fns.Run('c'),v=>v==='BC');
T('ternary + ??',`string name; string Run(){ return (name ?? "none") + (name == null ? "!" : "?"); }`,r=>r.fns.Run(),v=>v==='none!');
T('event combine',`
using System;
public event Action<int> OnX;
int total;
void Add(int v){ total += v; }
int Run(){ OnX += Add; OnX += Add; OnX?.Invoke(2); OnX -= Add; OnX?.Invoke(1); return total; }`,r=>r.fns.Run(),v=>v===5);
T('class instance list',`
using System.Collections.Generic;
class Item { public string name; public int price; public Item(string n, int p){ name=n; price=p; } }
public class Shop : MonoBehaviour { List<Item> items = new List<Item>(); public int Run(){ items.Add(new Item("a",3)); items.Add(new Item("b",7)); int s=0; foreach(Item it in items) s+=it.price; return s; } }`,r=>r.fns.Run(),v=>v===10);
T('null ref msg',`public class A : MonoBehaviour { Rigidbody2D rb; void Run(){ rb.AddForce(Vector3.zero); } }`,r=>r.fns.Run(),v=>false);
T('index range',`int Run(){ int[] a = new int[3]; return a[3]; }`,r=>r.fns.Run(),v=>false);
T('switch expression (미지원 확인)',`int Run(int x){ return x switch { 1 => 10, _ => 0 }; }`,r=>r.fns.Run(1),v=>v===10);
T('do-while + break/continue',`int Run(){ int i=0,s=0; do { i++; if(i%2==0) continue; if(i>7) break; s+=i; } while(i<10); return s; }`,r=>r.fns.Run(),v=>v===16);
T('compile CS0029',`void Run(){ int n = 3; if (n) { } }`,r=>r.fns.Run(),v=>false);
T('string methods',`string Run(){ string s = "Hello"; return s.ToUpper() + s.Length + s.Substring(1,2) + string.Join(",", new string[]{"a","b"}); }`,r=>r.fns.Run(),v=>v==='HELLO5ela,b');
T('nested generic',`using System.Collections.Generic; int Run(){ var m = new Dictionary<string, List<int>>(); m["x"] = new List<int>(); m["x"].Add(3); return m["x"][0]; }`,r=>r.fns.Run(),v=>v===3);
T('char + array init',`int Run(){ int[] a = {3,4,5}; int s=0; for(int i=0;i<a.Length;i++) s+=a[i]; return s; }`,r=>r.fns.Run(),v=>v===12);
T('out param user method',`bool Try(int x, out int y){ y = x*2; return true; } int Run(){ if (Try(4, out var r)) return r; return 0; }`,r=>r.fns.Run(),v=>v===8);
T('ref param',`void Inc(ref int x){ x++; } int Run(){ int a=1; Inc(ref a); Inc(ref a); return a; }`,r=>r.fns.Run(),v=>v===3);
T('const + readonly',`const float G = 9.8f; readonly int max = 3; float Run(){ return G * max; }`,r=>r.fns.Run(),v=>Math.abs(v-29.4)<1e-4);
T('coroutine',`using System.Collections; IEnumerator Co(){ yield return null; yield return 5; } int Run(){ int n=0; var e = Co(); return 0; }`,r=>{const g=r.fns.Co();return [...g].length},v=>v===2);
T('interface impl',`interface IHit { void Hit(int d); } class Box : IHit { public int hp=10; public void Hit(int d){ hp-=d; } } public class M : MonoBehaviour { public int Run(){ IHit h = new Box(); h.Hit(3); return ((Box)h).hp; } }`,r=>r.fns.Run(),v=>v===7);
T('is pattern',`class E { } class B : E { public int v=4; } public class M : MonoBehaviour { public int Run(){ E e = new B(); if (e is B b) return b.v; return 0; } }`,r=>r.fns.Run(),v=>v===4);
T('Debug.Log formatting',`void Run(){ float x = 0.1f + 0.2f; Debug.Log("x=" + x + " ok=" + true); }`,r=>{r.fns.Run();return logs.pop()},v=>v==='x=0.3 ok=True');
T('missing return',`int Run(int x){ if (x > 0) return 1; }`,r=>r.fns.Run(-1),v=>false);
