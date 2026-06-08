import{i as z}from"./assets/sql-wasm-rh7zkpck.js";import{c as J,b as Q,a as X}from"./assets/multi-year-stats-C6k26yW6.js";import"./assets/_commonjsHelpers-C932wzq6.js";const Z=""+new URL("assets/sql-wasm-UFUCzYNW.wasm",import.meta.url).href;self.addEventListener("install",()=>self.skipWaiting());self.addEventListener("activate",t=>t.waitUntil(self.clients.claim()));const H=new Map;let b=null;async function V(){return b||(b=await z({locateFile:()=>Z})),b}self.addEventListener("message",async t=>{var i;if(((i=t.data)==null?void 0:i.type)==="LOAD_SQLITE")try{const o=await V(),a=new o.Database(new Uint8Array(t.data.buffer)),y=`local-${crypto.randomUUID().slice(0,12)}`;H.set(y,a),t.source.postMessage({type:"SQLITE_LOADED",simulation_id:y})}catch(o){t.source.postMessage({type:"SQLITE_ERROR",error:String(o)})}});self.addEventListener("fetch",t=>{const i=new URL(t.request.url),o=i.pathname.match(/^\/api\/simulation\/(local-[^/]+)(\/[^?]*)?/);if(!o)return;const a=o[1],y=(o[2]||"").replace(/^\//,"");H.has(a)&&t.respondWith(nt(a,y,i.searchParams))});function l(t,i,o=[]){const a=t.exec(i,o);if(!a||a.length===0)return[];const{columns:y,values:S}=a[0];return S.map(N=>Object.fromEntries(y.map((A,T)=>[A,N[T]])))}function R(t){return new Response(JSON.stringify(t),{headers:{"Content-Type":"application/json"}})}function g(){return new Response("Not found",{status:404})}function w(t,i){if(i!=null&&i!==""){const a=l(t,"SELECT id FROM simulation_runs WHERE year = ?",[Number(i)]);if(a.length>0)return a[0].id}const o=l(t,"SELECT id FROM simulation_runs ORDER BY year DESC LIMIT 1");return o.length>0?o[0].id:null}function k(t){return l(t,"PRAGMA table_info(projects)").some(i=>i.name==="start_year")}function tt(t,i,o){if(!k(t))return{db_mode:"single_year",simulation_year:o};const a=l(t,"SELECT start_year, duration FROM projects WHERE run_id = ?",[i]),y=l(t,`SELECT start_year,
            COUNT(*) AS total,
            SUM(CASE WHEN main_contractor_id IS NULL THEN 1 ELSE 0 END) AS unassigned
     FROM projects WHERE run_id = ? GROUP BY start_year ORDER BY start_year`,[i]),S=J(a,o),N=Q(y);return X(o,S,N)}function K(t){return t>=2e8?.1:t>=1e8||t>=5e7?.2:t>=2e7||t>=1e7?.3:t>=5e6?.4:t>=1e6?.5:t>=1e5?.6:1}function D(t){return t>=2e8?"Mega ($200M+)":t>=1e8?"Large ($100–200M)":t>=5e7?"Large ($50–100M)":t>=2e7?"Mid ($20–50M)":t>=1e7?"Mid ($10–20M)":t>=5e6?"Mid ($5–10M)":t>=1e6?"Small ($1–5M)":t>=1e5?"Micro ($100K–1M)":"Sole trader (<$100K)"}function x(t){return t>=5e7?"National":t>=5e6?"Multi-region":"Regional"}const at=["Sole trader (<$100K)","Micro ($100K–1M)","Small ($1–5M)","Mid ($5–10M)","Mid ($10–20M)","Mid ($20–50M)","Large ($50–100M)","Large ($100–200M)","Mega ($200M+)"];function I(t){const i=t.initial_turnover||0;return{...t,in_house_pct:K(i),size_band:D(i),reach:x(i)}}const B={fully_allocated:"F",partial:"P",unassigned:"N"},rt={value:"p.value",paw:"p.paw",project_id:"p.project_id",allocation_status:"p.allocation_status",duration:"p.duration",start_year:"start_year",main_contractor_id:"p.main_contractor_id",sub_count:"(SELECT COUNT(*) FROM project_subs ps WHERE ps.run_id = p.run_id AND ps.project_id = p.project_id)",alloc_pct:"(p.paw - p.remaining_workload) * 1.0 / MAX(p.paw, 1)"};function C(t,i="p"){return k(t)?`${i}.start_year`:`(SELECT year FROM simulation_runs WHERE id = ${i}.run_id)`}const ot={initial_turnover:"initial_turnover",turnover:"turnover",cac:"cac",company_id:"company_id",main_awards:"main_awards",sub_awards:"sub_awards",primary_region:"primary_region",utilisation:"(initial_turnover - turnover) * 1.0 / MAX(initial_turnover, 1)"},P={"Mega ($200M+)":[2e8,null],"Large ($100–200M)":[1e8,2e8],"Large ($50–100M)":[5e7,1e8],"Mid ($20–50M)":[2e7,5e7],"Mid ($10–20M)":[1e7,2e7],"Mid ($5–10M)":[5e6,1e7],"Small ($1–5M)":[1e6,5e6],"Micro ($100K–1M)":[1e5,1e6],"Sole trader (<$100K)":[0,1e5]};async function nt(t,i,o){var U,W,F;const a=H.get(t),y=o.get("year"),S=y!=null&&y!==""?Number(y):null;if(i==="status")return R({status:"done"});if(i===""){const n=w(a,S);if(n==null)return g();const s=l(a,"SELECT * FROM simulation_runs WHERE id = ?",[n]);if(s.length===0)return g();const e=s[0],d=l(a,`SELECT region, category,
              SUM(CASE WHEN main_contractor_id IS NULL THEN paw
                       WHEN remaining_workload > 1 THEN remaining_workload
                       ELSE 0 END) AS unalloc_paw
       FROM projects WHERE run_id = ?
       GROUP BY region, category`,[n]),_={};for(const c of d)_[c.region]||(_[c.region]={}),_[c.region][c.category]=c.unalloc_paw||0;const E=l(a,`SELECT region, category, SUM(paw) AS total_paw
       FROM projects WHERE run_id = ?
       GROUP BY region, category`,[n]),r={};for(const c of E)r[c.region]||(r[c.region]={}),r[c.region][c.category]=c.total_paw||0;const u=l(a,"SELECT initial_turnover, turnover FROM companies WHERE run_id = ?",[n]),m=Object.fromEntries(at.map(c=>[c,{used:0,turnover_start:0,count:0,withCap:0}]));for(const c of u){const O=c.initial_turnover||0,v=c.turnover||0,h=D(O);m[h].used+=O-v,m[h].turnover_start+=O,m[h].count++,v>1&&m[h].withCap++}const M=l(a,"SELECT region, total, fully_allocated, partially_allocated, unassigned FROM region_breakdown WHERE run_id = ? ORDER BY region",[n]),L=Object.fromEntries(M.map(c=>[c.region,{total:c.total,fully_allocated:c.fully_allocated,partially_allocated:c.partially_allocated,unassigned:c.unassigned}])),j=tt(a,n,Number(e.year)),p=((U=l(a,`SELECT COUNT(*) AS n FROM projects p
       WHERE p.run_id = ? AND p.main_contractor_id IS NOT NULL
       AND NOT EXISTS (
         SELECT 1 FROM project_subs ps
         WHERE ps.run_id = p.run_id AND ps.project_id = p.project_id
       )`,[n])[0])==null?void 0:U.n)??0;return R({simulation_id:t,year:e.year,total_projects:e.total_projects,total_companies:e.total_companies,projects_with_main:e.projects_with_main,projects_fully_allocated:e.projects_fully_allocated,projects_partially_allocated:e.projects_partially_allocated,projects_unassigned:e.projects_unassigned,projects_without_subcontractor:e.projects_without_subcontractor??(p||0),total_value:e.total_value,total_paw:e.total_paw,total_value_allocated:e.total_value_allocated,total_value_unallocated:e.total_value_unallocated,average_subs_per_allocated_project:e.average_subs_per_allocated_project,companies_with_remaining_capacity:e.companies_with_remaining_capacity,heatmap:_,heatmap_total:r,band_utilisation:m,per_region_breakdown:L,...j})}if(i==="overview"){const n=l(a,"SELECT * FROM simulation_runs LIMIT 1");if(n.length===0)return g();const s=n[0];return R({simulation_id:t,year:s.year,stats:s})}if(i==="projects"){const n=Math.min(parseInt(o.get("limit")||"50",10),500),s=parseInt(o.get("offset")||"0",10),e=o.get("region")||null,d=o.get("category")||null,_=o.get("status")||null,E=o.get("sort")||"value",r=o.get("order")||"desc",u=o.get("search")||null;let m=rt[E]||"p.value";const M=r==="asc"?"ASC":"DESC",L=w(a,S);if(L==null)return g();const j=C(a,"p");E==="start_year"&&(m=j);const f=["p.run_id = ?"],p=[L];e&&(f.push("p.region = ?"),p.push(e)),d&&(f.push("p.category = ?"),p.push(d)),_&&B[_]&&(f.push("p.allocation_status = ?"),p.push(B[_])),u&&(f.push("CAST(p.project_id AS TEXT) LIKE ?"),p.push(`%${u}%`));const c=f.join(" AND "),O=l(a,`SELECT p.project_id, p.value, p.category, p.region, p.duration,
              ${j} AS start_year, p.paw,
              p.main_contractor_id, p.main_allocated, p.remaining_workload,
              p.allocation_status,
              (SELECT COUNT(*) FROM project_subs ps WHERE ps.run_id = p.run_id AND ps.project_id = p.project_id) AS sub_count
       FROM projects p
       WHERE ${c}
       ORDER BY ${m} ${M}
       LIMIT ? OFFSET ?`,[...p,n,s]),h=((W=l(a,`SELECT COUNT(*) AS cnt FROM projects p WHERE ${c}`,p)[0])==null?void 0:W.cnt)??0;return R({total:h,limit:n,offset:s,rows:O})}const N=i.match(/^projects\/(\d+)$/);if(N){const n=parseInt(N[1],10),s=w(a,S);if(s==null)return g();const e=C(a,"projects"),d=l(a,`SELECT project_id, value, category, region, duration,
              ${e} AS start_year, paw,
              main_contractor_id, main_allocated, remaining_workload, allocation_status
       FROM projects WHERE run_id = ? AND project_id = ?`,[s,n]);return d.length===0?g():R(d[0])}const A=i.match(/^projects\/(\d+)\/contractors$/);if(A){const n=parseInt(A[1],10),s=w(a,S);if(s==null)return g();const e=l(a,"SELECT main_contractor_id, main_allocated FROM projects WHERE run_id = ? AND project_id = ?",[s,n]);if(e.length===0)return g();const d=e[0];let _=null;if(d.main_contractor_id!=null){const u=l(a,`SELECT company_id, category, primary_region, initial_turnover,
                turnover, initial_cac, cac, rac, main_awards, sub_awards
         FROM companies WHERE run_id = ? AND company_id = ?`,[s,d.main_contractor_id]);u.length>0&&(_={...I(u[0]),allocated:d.main_allocated||0})}const r=l(a,`SELECT ps.company_id, ps.amount,
              c.category, c.primary_region, c.initial_turnover,
              c.turnover, c.initial_cac, c.cac, c.rac, c.main_awards, c.sub_awards
       FROM project_subs ps
       JOIN companies c ON c.run_id = ps.run_id AND c.company_id = ps.company_id
       WHERE ps.run_id = ? AND ps.project_id = ?
       ORDER BY ps.amount DESC`,[s,n]).map(u=>({...I({company_id:u.company_id,category:u.category,primary_region:u.primary_region,initial_turnover:u.initial_turnover,turnover:u.turnover,initial_cac:u.initial_cac,cac:u.cac,rac:u.rac,main_awards:u.main_awards,sub_awards:u.sub_awards}),allocated:u.amount||0}));return R({project_id:n,main:_,subcontractors:r})}if(i==="companies"){const n=Math.min(parseInt(o.get("limit")||"50",10),500),s=parseInt(o.get("offset")||"0",10),e=o.get("region")||null,d=o.get("category")||null,_=o.get("size_band")||null,E=o.get("role")||null,r=o.get("reach")||null,u=o.get("sort")||"initial_turnover",m=o.get("order")||"desc",M=o.get("search")||null,L=ot[u]||"initial_turnover",j=m==="asc"?"ASC":"DESC",f=w(a,S);if(f==null)return g();const p=["run_id = ?"],c=[f];if(e&&(p.push("primary_region = ?"),c.push(e)),d&&(p.push("category = ?"),c.push(d)),_&&P[_]){const[q,Y]=P[_];p.push("initial_turnover >= ?"),c.push(q),Y!=null&&(p.push("initial_turnover < ?"),c.push(Y))}r==="National"?p.push("initial_turnover >= 50000000"):r==="Multi-region"?(p.push("initial_turnover >= 5000000"),p.push("initial_turnover < 50000000")):r==="Regional"&&p.push("initial_turnover < 5000000"),E==="main"?p.push("(category LIKE 'E301 %' OR category LIKE 'E302 %' OR category LIKE 'E310 %')"):E==="sub"&&p.push("NOT (category LIKE 'E301 %' OR category LIKE 'E302 %' OR category LIKE 'E310 %')"),M&&(p.push("CAST(company_id AS TEXT) LIKE ?"),c.push(`%${M}%`));const O=p.join(" AND "),v=l(a,`SELECT company_id, category, primary_region, initial_turnover,
              turnover, initial_cac, cac, rac, main_awards, sub_awards
       FROM companies WHERE ${O}
       ORDER BY ${L} ${j}
       LIMIT ? OFFSET ?`,[...c,n,s]),G=((F=l(a,`SELECT COUNT(*) AS cnt FROM companies WHERE ${O}`,c)[0])==null?void 0:F.cnt)??0;return R({total:G,limit:n,offset:s,rows:v})}const T=i.match(/^companies\/(\d+)$/);if(T){const n=parseInt(T[1],10),s=w(a,S);if(s==null)return g();const e=l(a,`SELECT company_id, category, primary_region, initial_turnover,
              turnover, initial_cac, cac, rac, main_awards, sub_awards
       FROM companies WHERE run_id = ? AND company_id = ?`,[s,n]);return e.length===0?g():R(I(e[0]))}const $=i.match(/^companies\/(\d+)\/projects$/);if($){const n=parseInt($[1],10),s=o.get("role")||"all",e=Math.min(parseInt(o.get("limit")||"50",10),500),d=parseInt(o.get("offset")||"0",10),_=w(a,S);if(_==null)return g();let E=[];const r=C(a,"p");(s==="all"||s==="main")&&(E=E.concat(l(a,`SELECT p.project_id, p.value, p.paw, p.category, p.region,
                ${r} AS start_year,
                'main' AS role, p.main_allocated AS allocated
         FROM projects p WHERE p.run_id = ? AND p.main_contractor_id = ?
         ORDER BY p.main_allocated DESC`,[_,n]))),(s==="all"||s==="sub")&&(E=E.concat(l(a,`SELECT p.project_id, p.value, p.paw, p.category, p.region,
                ${r} AS start_year,
                'sub' AS role, ps.amount AS allocated
         FROM project_subs ps
         JOIN projects p ON p.run_id = ps.run_id AND p.project_id = ps.project_id
         WHERE ps.run_id = ? AND ps.company_id = ?
         ORDER BY ps.amount DESC`,[_,n]))),E.sort((M,L)=>(L.allocated||0)-(M.allocated||0));const u=E.length,m=E.slice(d,d+e);return R({total:u,limit:e,offset:d,rows:m})}if(i==="agg"){const n=w(a,S);if(n==null)return g();const s=l(a,`SELECT p.region, p.category,
              SUM(p.paw)               AS total_paw,
              SUM(p.main_allocated)    AS total_main,
              COALESCE(SUM(ps.sub_total), 0) AS total_sub,
              SUM(p.remaining_workload) AS total_remaining,
              COUNT(CASE WHEN p.main_contractor_id IS NULL THEN 1 END) AS unassigned_count,
              COUNT(CASE WHEN p.main_contractor_id IS NOT NULL
                         AND COALESCE(ps.sub_total, 0) = 0 THEN 1 END) AS no_sub_count,
              SUM(CASE WHEN p.main_contractor_id IS NULL THEN p.paw
                       WHEN p.remaining_workload > 1   THEN p.remaining_workload
                       ELSE 0 END)    AS unalloc_paw,
              SUM(p.value) AS total_value,
              SUM(CASE WHEN p.main_contractor_id IS NULL THEN p.value
                       WHEN p.remaining_workload > 1 AND p.paw > 0
                         THEN p.value * (p.remaining_workload / p.paw)
                       ELSE 0 END) AS unallocated_value
       FROM projects p
       LEFT JOIN (
           SELECT run_id, project_id, SUM(amount) AS sub_total
           FROM project_subs GROUP BY run_id, project_id
       ) ps ON ps.run_id = p.run_id AND ps.project_id = p.project_id
       WHERE p.run_id = ?
       GROUP BY p.region, p.category`,[n]),e=l(a,`SELECT primary_region, category,
              SUM(initial_turnover) AS total_initial,
              SUM(turnover)         AS total_remaining,
              COUNT(*)              AS count
       FROM companies WHERE run_id = ?
       GROUP BY primary_region, category`,[n]),d=C(a,"projects"),_=l(a,`SELECT project_id, value, paw, category, region, duration,
              ${d} AS start_year
       FROM projects WHERE run_id = ? AND main_contractor_id IS NULL
       ORDER BY value DESC LIMIT 8`,[n]),E=l(a,`SELECT company_id, category, primary_region, initial_turnover, turnover
       FROM companies WHERE run_id = ? AND turnover > 1
       ORDER BY turnover DESC LIMIT 6`,[n]);return R({project_agg:s.map(r=>({region:r.region,category:r.category,total_paw:r.total_paw||0,total_main:r.total_main||0,total_sub:r.total_sub||0,total_remaining:r.total_remaining||0,unassigned_count:r.unassigned_count||0,no_sub_count:r.no_sub_count||0,unalloc_paw:r.unalloc_paw||0,total_value:r.total_value||0,unallocated_value:r.unallocated_value||0})),company_agg:e.map(r=>({region:r.primary_region,category:r.category,total_initial:r.total_initial||0,total_remaining:r.total_remaining||0,count:r.count||0})),top_unassigned:_.map(r=>({project_id:r.project_id,value:r.value||0,paw:r.paw||0,category:r.category,region:r.region,duration:r.duration||1,start_year:r.start_year,main_contractor_id:null,main_allocated:0,remaining_workload:r.paw||0,subcontractors:[],status:"unassigned"})),top_spare:E.map(r=>{const u=r.initial_turnover||0;return{company_id:r.company_id,category:r.category,primary_region:r.primary_region,region:r.primary_region,initial_turnover:u,turnover:r.turnover||0,size_band:D(u),reach:x(u),in_house_pct:K(u),role:["E301 ","E302 ","E310 "].some(m=>(r.category||"").startsWith(m))?"main":"sub"}})})}if(i==="heatmap"){const n=w(a,S);if(n==null)return g();const s=l(a,`SELECT region, total, fully_allocated, partially_allocated, unassigned
       FROM region_breakdown WHERE run_id = ? ORDER BY region`,[n]),e=l(a,`SELECT category, total, fully_allocated, partially_allocated, unassigned
       FROM category_breakdown WHERE run_id = ? ORDER BY category`,[n]);return R({regions:s,categories:e})}return g()}
