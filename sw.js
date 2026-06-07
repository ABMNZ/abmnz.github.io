import{i as z}from"./assets/sql-wasm-rh7zkpck.js";import{c as J,b as Q,a as X}from"./assets/multi-year-stats-C6k26yW6.js";import"./assets/_commonjsHelpers-C932wzq6.js";const Z=""+new URL("assets/sql-wasm-UFUCzYNW.wasm",import.meta.url).href;self.addEventListener("install",()=>self.skipWaiting());self.addEventListener("activate",t=>t.waitUntil(self.clients.claim()));const I=new Map;let v=null;async function V(){return v||(v=await z({locateFile:()=>Z})),v}self.addEventListener("message",async t=>{var i;if(((i=t.data)==null?void 0:i.type)==="LOAD_SQLITE")try{const a=await V(),r=new a.Database(new Uint8Array(t.data.buffer)),S=`local-${crypto.randomUUID().slice(0,12)}`;I.set(S,r),t.source.postMessage({type:"SQLITE_LOADED",simulation_id:S})}catch(a){t.source.postMessage({type:"SQLITE_ERROR",error:String(a)})}});self.addEventListener("fetch",t=>{const i=new URL(t.request.url),a=i.pathname.match(/^\/api\/simulation\/(local-[^/]+)(\/[^?]*)?/);if(!a)return;const r=a[1],S=(a[2]||"").replace(/^\//,"");I.has(r)&&t.respondWith(ot(r,S,i.searchParams))});function l(t,i,a=[]){const r=t.exec(i,a);if(!r||r.length===0)return[];const{columns:S,values:m}=r[0];return m.map(h=>Object.fromEntries(S.map((A,N)=>[A,h[N]])))}function R(t){return new Response(JSON.stringify(t),{headers:{"Content-Type":"application/json"}})}function g(){return new Response("Not found",{status:404})}function M(t,i){if(i!=null&&i!==""){const r=l(t,"SELECT id FROM simulation_runs WHERE year = ?",[Number(i)]);if(r.length>0)return r[0].id}const a=l(t,"SELECT id FROM simulation_runs ORDER BY year DESC LIMIT 1");return a.length>0?a[0].id:null}function k(t){return l(t,"PRAGMA table_info(projects)").some(i=>i.name==="start_year")}function tt(t,i,a){if(!k(t))return{db_mode:"single_year",simulation_year:a};const r=l(t,"SELECT start_year, duration FROM projects WHERE run_id = ?",[i]),S=l(t,`SELECT start_year,
            COUNT(*) AS total,
            SUM(CASE WHEN main_contractor_id IS NULL THEN 1 ELSE 0 END) AS unassigned
     FROM projects WHERE run_id = ? GROUP BY start_year ORDER BY start_year`,[i]),m=J(r,a),h=Q(S);return X(a,m,h)}function K(t){return t>=2e8?.1:t>=1e8||t>=5e7?.2:t>=2e7||t>=1e7?.3:t>=5e6?.4:t>=1e6?.5:t>=1e5?.6:1}function b(t){return t>=2e8?"Mega ($200M+)":t>=1e8?"Large ($100–200M)":t>=5e7?"Large ($50–100M)":t>=2e7?"Mid ($20–50M)":t>=1e7?"Mid ($10–20M)":t>=5e6?"Mid ($5–10M)":t>=1e6?"Small ($1–5M)":t>=1e5?"Micro ($100K–1M)":"Sole trader (<$100K)"}function x(t){return t>=5e7?"National":t>=5e6?"Multi-region":"Regional"}const rt=["Sole trader (<$100K)","Micro ($100K–1M)","Small ($1–5M)","Mid ($5–10M)","Mid ($10–20M)","Mid ($20–50M)","Large ($50–100M)","Large ($100–200M)","Mega ($200M+)"];function C(t){const i=t.initial_turnover||0;return{...t,in_house_pct:K(i),size_band:b(i),reach:x(i)}}const B={fully_allocated:"F",partial:"P",unassigned:"N"},nt={value:"p.value",paw:"p.paw",project_id:"p.project_id",allocation_status:"p.allocation_status",duration:"p.duration",start_year:"start_year",main_contractor_id:"p.main_contractor_id",sub_count:"(SELECT COUNT(*) FROM project_subs ps WHERE ps.run_id = p.run_id AND ps.project_id = p.project_id)",alloc_pct:"(p.paw - p.remaining_workload) * 1.0 / MAX(p.paw, 1)"};function T(t,i="p"){return k(t)?`${i}.start_year`:`(SELECT year FROM simulation_runs WHERE id = ${i}.run_id)`}const at={initial_turnover:"initial_turnover",turnover:"turnover",cac:"cac",company_id:"company_id",main_awards:"main_awards",sub_awards:"sub_awards",primary_region:"primary_region",utilisation:"(initial_turnover - turnover) * 1.0 / MAX(initial_turnover, 1)"},P={"Mega ($200M+)":[2e8,null],"Large ($100–200M)":[1e8,2e8],"Large ($50–100M)":[5e7,1e8],"Mid ($20–50M)":[2e7,5e7],"Mid ($10–20M)":[1e7,2e7],"Mid ($5–10M)":[5e6,1e7],"Small ($1–5M)":[1e6,5e6],"Micro ($100K–1M)":[1e5,1e6],"Sole trader (<$100K)":[0,1e5]};async function ot(t,i,a){var $,H,U;const r=I.get(t),S=a.get("year"),m=S!=null&&S!==""?Number(S):null;if(i==="status")return R({status:"done"});if(i===""){const o=M(r,m);if(o==null)return g();const c=l(r,"SELECT * FROM simulation_runs WHERE id = ?",[o]);if(c.length===0)return g();const e=c[0],d=l(r,`SELECT region, category,
              SUM(CASE WHEN main_contractor_id IS NULL THEN paw
                       WHEN remaining_workload > 1 THEN remaining_workload
                       ELSE 0 END) AS unalloc_paw
       FROM projects WHERE run_id = ?
       GROUP BY region, category`,[o]),p={};for(const u of d)p[u.region]||(p[u.region]={}),p[u.region][u.category]=u.unalloc_paw||0;const E=l(r,"SELECT initial_turnover, turnover FROM companies WHERE run_id = ?",[o]),n=Object.fromEntries(rt.map(u=>[u,{used:0,turnover_start:0,count:0,withCap:0}]));for(const u of E){const _=u.initial_turnover||0,y=u.turnover||0,w=b(_);n[w].used+=_-y,n[w].turnover_start+=_,n[w].count++,y>1&&n[w].withCap++}const s=l(r,"SELECT region, total, fully_allocated, partially_allocated, unassigned FROM region_breakdown WHERE run_id = ? ORDER BY region",[o]),f=Object.fromEntries(s.map(u=>[u.region,{total:u.total,fully_allocated:u.fully_allocated,partially_allocated:u.partially_allocated,unassigned:u.unassigned}])),O=tt(r,o,Number(e.year)),j=(($=l(r,`SELECT COUNT(*) AS n FROM projects p
       WHERE p.run_id = ? AND p.main_contractor_id IS NOT NULL
       AND NOT EXISTS (
         SELECT 1 FROM project_subs ps
         WHERE ps.run_id = p.run_id AND ps.project_id = p.project_id
       )`,[o])[0])==null?void 0:$.n)??0;return R({simulation_id:t,year:e.year,total_projects:e.total_projects,total_companies:e.total_companies,projects_with_main:e.projects_with_main,projects_fully_allocated:e.projects_fully_allocated,projects_partially_allocated:e.projects_partially_allocated,projects_unassigned:e.projects_unassigned,projects_without_subcontractor:e.projects_without_subcontractor??(j||0),total_value:e.total_value,total_paw:e.total_paw,total_value_allocated:e.total_value_allocated,total_value_unallocated:e.total_value_unallocated,average_subs_per_allocated_project:e.average_subs_per_allocated_project,companies_with_remaining_capacity:e.companies_with_remaining_capacity,heatmap:p,band_utilisation:n,per_region_breakdown:f,...O})}if(i==="overview"){const o=l(r,"SELECT * FROM simulation_runs LIMIT 1");if(o.length===0)return g();const c=o[0];return R({simulation_id:t,year:c.year,stats:c})}if(i==="projects"){const o=Math.min(parseInt(a.get("limit")||"50",10),500),c=parseInt(a.get("offset")||"0",10),e=a.get("region")||null,d=a.get("category")||null,p=a.get("status")||null,E=a.get("sort")||"value",n=a.get("order")||"desc",s=a.get("search")||null;let f=nt[E]||"p.value";const O=n==="asc"?"ASC":"DESC",L=M(r,m);if(L==null)return g();const j=T(r,"p");E==="start_year"&&(f=j);const u=["p.run_id = ?"],_=[L];e&&(u.push("p.region = ?"),_.push(e)),d&&(u.push("p.category = ?"),_.push(d)),p&&B[p]&&(u.push("p.allocation_status = ?"),_.push(B[p])),s&&(u.push("CAST(p.project_id AS TEXT) LIKE ?"),_.push(`%${s}%`));const y=u.join(" AND "),w=l(r,`SELECT p.project_id, p.value, p.category, p.region, p.duration,
              ${j} AS start_year, p.paw,
              p.main_contractor_id, p.main_allocated, p.remaining_workload,
              p.allocation_status,
              (SELECT COUNT(*) FROM project_subs ps WHERE ps.run_id = p.run_id AND ps.project_id = p.project_id) AS sub_count
       FROM projects p
       WHERE ${y}
       ORDER BY ${f} ${O}
       LIMIT ? OFFSET ?`,[..._,o,c]),W=((H=l(r,`SELECT COUNT(*) AS cnt FROM projects p WHERE ${y}`,_)[0])==null?void 0:H.cnt)??0;return R({total:W,limit:o,offset:c,rows:w})}const h=i.match(/^projects\/(\d+)$/);if(h){const o=parseInt(h[1],10),c=M(r,m);if(c==null)return g();const e=T(r,"projects"),d=l(r,`SELECT project_id, value, category, region, duration,
              ${e} AS start_year, paw,
              main_contractor_id, main_allocated, remaining_workload, allocation_status
       FROM projects WHERE run_id = ? AND project_id = ?`,[c,o]);return d.length===0?g():R(d[0])}const A=i.match(/^projects\/(\d+)\/contractors$/);if(A){const o=parseInt(A[1],10),c=M(r,m);if(c==null)return g();const e=l(r,"SELECT main_contractor_id, main_allocated FROM projects WHERE run_id = ? AND project_id = ?",[c,o]);if(e.length===0)return g();const d=e[0];let p=null;if(d.main_contractor_id!=null){const s=l(r,`SELECT company_id, category, primary_region, initial_turnover,
                turnover, initial_cac, cac, rac, main_awards, sub_awards
         FROM companies WHERE run_id = ? AND company_id = ?`,[c,d.main_contractor_id]);s.length>0&&(p={...C(s[0]),allocated:d.main_allocated||0})}const n=l(r,`SELECT ps.company_id, ps.amount,
              c.category, c.primary_region, c.initial_turnover,
              c.turnover, c.initial_cac, c.cac, c.rac, c.main_awards, c.sub_awards
       FROM project_subs ps
       JOIN companies c ON c.run_id = ps.run_id AND c.company_id = ps.company_id
       WHERE ps.run_id = ? AND ps.project_id = ?
       ORDER BY ps.amount DESC`,[c,o]).map(s=>({...C({company_id:s.company_id,category:s.category,primary_region:s.primary_region,initial_turnover:s.initial_turnover,turnover:s.turnover,initial_cac:s.initial_cac,cac:s.cac,rac:s.rac,main_awards:s.main_awards,sub_awards:s.sub_awards}),allocated:s.amount||0}));return R({project_id:o,main:p,subcontractors:n})}if(i==="companies"){const o=Math.min(parseInt(a.get("limit")||"50",10),500),c=parseInt(a.get("offset")||"0",10),e=a.get("region")||null,d=a.get("category")||null,p=a.get("size_band")||null,E=a.get("role")||null,n=a.get("reach")||null,s=a.get("sort")||"initial_turnover",f=a.get("order")||"desc",O=a.get("search")||null,L=at[s]||"initial_turnover",j=f==="asc"?"ASC":"DESC",u=M(r,m);if(u==null)return g();const _=["run_id = ?"],y=[u];if(e&&(_.push("primary_region = ?"),y.push(e)),d&&(_.push("category = ?"),y.push(d)),p&&P[p]){const[q,Y]=P[p];_.push("initial_turnover >= ?"),y.push(q),Y!=null&&(_.push("initial_turnover < ?"),y.push(Y))}n==="National"?_.push("initial_turnover >= 50000000"):n==="Multi-region"?(_.push("initial_turnover >= 5000000"),_.push("initial_turnover < 50000000")):n==="Regional"&&_.push("initial_turnover < 5000000"),E==="main"?_.push("(category LIKE 'E301 %' OR category LIKE 'E302 %' OR category LIKE 'E310 %')"):E==="sub"&&_.push("NOT (category LIKE 'E301 %' OR category LIKE 'E302 %' OR category LIKE 'E310 %')"),O&&(_.push("CAST(company_id AS TEXT) LIKE ?"),y.push(`%${O}%`));const w=_.join(" AND "),F=l(r,`SELECT company_id, category, primary_region, initial_turnover,
              turnover, initial_cac, cac, rac, main_awards, sub_awards
       FROM companies WHERE ${w}
       ORDER BY ${L} ${j}
       LIMIT ? OFFSET ?`,[...y,o,c]),G=((U=l(r,`SELECT COUNT(*) AS cnt FROM companies WHERE ${w}`,y)[0])==null?void 0:U.cnt)??0;return R({total:G,limit:o,offset:c,rows:F})}const N=i.match(/^companies\/(\d+)$/);if(N){const o=parseInt(N[1],10),c=M(r,m);if(c==null)return g();const e=l(r,`SELECT company_id, category, primary_region, initial_turnover,
              turnover, initial_cac, cac, rac, main_awards, sub_awards
       FROM companies WHERE run_id = ? AND company_id = ?`,[c,o]);return e.length===0?g():R(C(e[0]))}const D=i.match(/^companies\/(\d+)\/projects$/);if(D){const o=parseInt(D[1],10),c=a.get("role")||"all",e=Math.min(parseInt(a.get("limit")||"50",10),500),d=parseInt(a.get("offset")||"0",10),p=M(r,m);if(p==null)return g();let E=[];const n=T(r,"p");(c==="all"||c==="main")&&(E=E.concat(l(r,`SELECT p.project_id, p.value, p.paw, p.category, p.region,
                ${n} AS start_year,
                'main' AS role, p.main_allocated AS allocated
         FROM projects p WHERE p.run_id = ? AND p.main_contractor_id = ?
         ORDER BY p.main_allocated DESC`,[p,o]))),(c==="all"||c==="sub")&&(E=E.concat(l(r,`SELECT p.project_id, p.value, p.paw, p.category, p.region,
                ${n} AS start_year,
                'sub' AS role, ps.amount AS allocated
         FROM project_subs ps
         JOIN projects p ON p.run_id = ps.run_id AND p.project_id = ps.project_id
         WHERE ps.run_id = ? AND ps.company_id = ?
         ORDER BY ps.amount DESC`,[p,o]))),E.sort((O,L)=>(L.allocated||0)-(O.allocated||0));const s=E.length,f=E.slice(d,d+e);return R({total:s,limit:e,offset:d,rows:f})}if(i==="agg"){const o=M(r,m);if(o==null)return g();const c=l(r,`SELECT p.region, p.category,
              SUM(p.paw)               AS total_paw,
              SUM(p.main_allocated)    AS total_main,
              COALESCE(SUM(ps.sub_total), 0) AS total_sub,
              SUM(p.remaining_workload) AS total_remaining,
              COUNT(CASE WHEN p.main_contractor_id IS NULL THEN 1 END) AS unassigned_count,
              COUNT(CASE WHEN p.main_contractor_id IS NOT NULL
                         AND COALESCE(ps.sub_total, 0) = 0 THEN 1 END) AS no_sub_count,
              SUM(CASE WHEN p.main_contractor_id IS NULL THEN p.paw
                       WHEN p.remaining_workload > 1   THEN p.remaining_workload
                       ELSE 0 END)    AS unalloc_paw
       FROM projects p
       LEFT JOIN (
           SELECT run_id, project_id, SUM(amount) AS sub_total
           FROM project_subs GROUP BY run_id, project_id
       ) ps ON ps.run_id = p.run_id AND ps.project_id = p.project_id
       WHERE p.run_id = ?
       GROUP BY p.region, p.category`,[o]),e=l(r,`SELECT primary_region, category,
              SUM(initial_turnover) AS total_initial,
              SUM(turnover)         AS total_remaining,
              COUNT(*)              AS count
       FROM companies WHERE run_id = ?
       GROUP BY primary_region, category`,[o]),d=T(r,"projects"),p=l(r,`SELECT project_id, value, paw, category, region, duration,
              ${d} AS start_year
       FROM projects WHERE run_id = ? AND main_contractor_id IS NULL
       ORDER BY value DESC LIMIT 8`,[o]),E=l(r,`SELECT company_id, category, primary_region, initial_turnover, turnover
       FROM companies WHERE run_id = ? AND turnover > 1
       ORDER BY turnover DESC LIMIT 6`,[o]);return R({project_agg:c.map(n=>({region:n.region,category:n.category,total_paw:n.total_paw||0,total_main:n.total_main||0,total_sub:n.total_sub||0,total_remaining:n.total_remaining||0,unassigned_count:n.unassigned_count||0,no_sub_count:n.no_sub_count||0,unalloc_paw:n.unalloc_paw||0})),company_agg:e.map(n=>({region:n.primary_region,category:n.category,total_initial:n.total_initial||0,total_remaining:n.total_remaining||0,count:n.count||0})),top_unassigned:p.map(n=>({project_id:n.project_id,value:n.value||0,paw:n.paw||0,category:n.category,region:n.region,duration:n.duration||1,start_year:n.start_year,main_contractor_id:null,main_allocated:0,remaining_workload:n.paw||0,subcontractors:[],status:"unassigned"})),top_spare:E.map(n=>{const s=n.initial_turnover||0;return{company_id:n.company_id,category:n.category,primary_region:n.primary_region,region:n.primary_region,initial_turnover:s,turnover:n.turnover||0,size_band:b(s),reach:x(s),in_house_pct:K(s),role:["E301 ","E302 ","E310 "].some(f=>(n.category||"").startsWith(f))?"main":"sub"}})})}if(i==="heatmap"){const o=M(r,m);if(o==null)return g();const c=l(r,`SELECT region, total, fully_allocated, partially_allocated, unassigned
       FROM region_breakdown WHERE run_id = ? ORDER BY region`,[o]),e=l(r,`SELECT category, total, fully_allocated, partially_allocated, unassigned
       FROM category_breakdown WHERE run_id = ? ORDER BY category`,[o]);return R({regions:c,categories:e})}return g()}
