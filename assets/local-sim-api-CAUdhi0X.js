import{getSimDb as L}from"./simulation-engine-dpkCXSIK.js";import{c as U,b as F,a as W}from"./multi-year-stats-C6k26yW6.js";import"./main-DeFjK5oY.js";import"./_commonjsHelpers-C932wzq6.js";function C(a){return a>=2e8?.1:a>=1e8||a>=5e7?.2:a>=2e7||a>=1e7?.3:a>=5e6?.4:a>=1e6?.5:a>=1e5?.6:1}function j(a){return a>=2e8?"Mega ($200M+)":a>=1e8?"Large ($100–200M)":a>=5e7?"Large ($50–100M)":a>=2e7?"Mid ($20–50M)":a>=1e7?"Mid ($10–20M)":a>=5e6?"Mid ($5–10M)":a>=1e6?"Small ($1–5M)":a>=1e5?"Micro ($100K–1M)":"Sole trader (<$100K)"}function T(a){return a>=5e7?"National":a>=5e6?"Multi-region":"Regional"}const Y=["Sole trader (<$100K)","Micro ($100K–1M)","Small ($1–5M)","Mid ($5–10M)","Mid ($10–20M)","Mid ($20–50M)","Large ($50–100M)","Large ($100–200M)","Mega ($200M+)"],O={"Mega ($200M+)":[2e8,null],"Large ($100–200M)":[1e8,2e8],"Large ($50–100M)":[5e7,1e8],"Mid ($20–50M)":[2e7,5e7],"Mid ($10–20M)":[1e7,2e7],"Mid ($5–10M)":[5e6,1e7],"Small ($1–5M)":[1e6,5e6],"Micro ($100K–1M)":[1e5,1e6],"Sole trader (<$100K)":[0,1e5]},A={fully_allocated:"F",partial:"P",unassigned:"N"},B={value:"p.value",paw:"p.paw",project_id:"p.project_id",allocation_status:"p.allocation_status",duration:"p.duration",start_year:"start_year",main_contractor_id:"p.main_contractor_id",region:"p.region",category:"p.category",sub_count:"(SELECT COUNT(*) FROM project_subs ps WHERE ps.run_id = p.run_id AND ps.project_id = p.project_id)",alloc_pct:"(p.paw - p.remaining_workload) * 1.0 / MAX(p.paw, 0.001)"};function h(a){return u(a,"PRAGMA table_info(projects)").some(n=>n.name==="start_year")}function M(a,n="p"){return h(a)?`${n}.start_year`:`(SELECT year FROM simulation_runs WHERE id = ${n}.run_id)`}const I={initial_turnover:"initial_turnover",turnover:"turnover",cac:"cac",company_id:"company_id",main_awards:"main_awards",sub_awards:"sub_awards",primary_region:"primary_region",utilisation:"(initial_turnover - turnover) * 1.0 / MAX(initial_turnover, 1)"};function k(a){return u(a,"SELECT id, year FROM simulation_runs ORDER BY year")}function P(a,n){if(a.runsByYear instanceof Map){if(n!=null&&a.runsByYear.has(Number(n)))return a.runsByYear.get(Number(n));if(a.run_id!=null)return a.run_id;const r=[...a.runsByYear.keys()].sort((t,e)=>t-e);return a.runsByYear.get(r[r.length-1])}return a.run_id}function v(a,n){const r=L(a);if(!r)throw new Error(`Unknown local simulation: ${a}`);const t=P(r,n);return{...r,run_id:t}}function K(a,n,r){const t=u(a,"SELECT start_year, duration FROM projects WHERE run_id = ?",[n]),e=u(a,`SELECT start_year,
            COUNT(*) AS total,
            SUM(CASE WHEN main_contractor_id IS NULL THEN 1 ELSE 0 END) AS unassigned
     FROM projects WHERE run_id = ? GROUP BY start_year ORDER BY start_year`,[n]),_=U(t,r),s=F(e);return W(r,_,s)}function G(a,n,r,t,e){const _=Number(t.year),s={year:_,total_projects:t.total_projects??0,total_companies:t.total_companies??0,projects_with_main:t.projects_with_main??0,projects_fully_allocated:t.projects_fully_allocated??0,projects_partially_allocated:t.projects_partially_allocated??0,projects_unassigned:t.projects_unassigned??0,projects_without_subcontractor:t.projects_without_subcontractor??0,total_value:t.total_value??0,total_paw:t.total_paw??0,total_value_allocated:t.total_value_allocated??0,total_value_unallocated:t.total_value_unallocated??0,average_subs_per_allocated_project:t.average_subs_per_allocated_project??0,companies_with_remaining_capacity:t.companies_with_remaining_capacity??0,heatmap:t.heatmap||{},heatmap_total:t.heatmap_total||null,band_utilisation:t.band_utilisation||{},per_region_breakdown:t.per_region_breakdown||null,project_agg:e.project_agg||[],company_agg:e.company_agg||[]};return h(n)?Object.assign(s,K(n,r,_)):(s.db_mode="single_year",s.simulation_year=_),{year:_,params:{source:"local",simulation_id:a},projects:e.top_unassigned||[],companies:(e.top_spare||[]).map(l=>({...l,awarded_main:[],awarded_sub:[]})),stats:s}}function x(a,n){const r=u(a,`SELECT year, total_projects, total_companies, projects_with_main,
            projects_fully_allocated, projects_partially_allocated, projects_unassigned,
            total_value, total_paw, total_value_allocated, total_value_unallocated,
            average_subs_per_allocated_project, companies_with_remaining_capacity
     FROM simulation_runs WHERE id = ?`,[n]);if(!r.length)return null;const t=r[0];return{year:t.year,total_projects:t.total_projects??0,total_companies:t.total_companies??0,projects_with_main:t.projects_with_main??0,projects_fully_allocated:t.projects_fully_allocated??0,projects_partially_allocated:t.projects_partially_allocated??0,projects_unassigned:t.projects_unassigned??0,total_value:t.total_value??0,total_paw:t.total_paw??0,total_value_allocated:t.total_value_allocated??0,total_value_unallocated:t.total_value_unallocated??0,average_subs_per_allocated_project:t.average_subs_per_allocated_project??0,companies_with_remaining_capacity:t.companies_with_remaining_capacity??0}}function u(a,n,r=[]){const t=a.exec(n,r);if(!t.length)return[];const{columns:e,values:_}=t[0];return _.map(s=>{const l={};return e.forEach((c,o)=>l[c]=s[o]),l})}function b(a,n,r=[]){const t=a.exec(n,r);return!t.length||!t[0].values.length?null:t[0].values[0][0]}function D(a){return{company_id:a.company_id,category:a.category,primary_region:a.primary_region,initial_turnover:a.initial_turnover||0,turnover:a.turnover,initial_cac:a.initial_cac,cac:a.cac,rac:a.rac,main_awards:a.main_awards,sub_awards:a.sub_awards}}function $(a){const n=D(a),r=n.initial_turnover;return n.in_house_pct=C(r),n.size_band=j(r),n.reach=T(r),n}function X(a,n){const r=v(a,n),{db:t,run_id:e}=r,_=r.stats??x(t,e),s=(_==null?void 0:_.year)??r.year,l=u(t,`SELECT region, category,
            SUM(CASE WHEN main_contractor_id IS NULL THEN paw
                     WHEN remaining_workload > 1    THEN remaining_workload
                     ELSE 0 END) AS unalloc_paw
     FROM projects WHERE run_id = ?
     GROUP BY region, category`,[e]),c={};for(const i of l)c[i.region]||(c[i.region]={}),c[i.region][i.category]=i.unalloc_paw||0;const o=u(t,`SELECT region, category, SUM(paw) AS total_paw
     FROM projects WHERE run_id = ?
     GROUP BY region, category`,[e]),m={};for(const i of o)m[i.region]||(m[i.region]={}),m[i.region][i.category]=i.total_paw||0;const p=u(t,"SELECT initial_turnover, turnover FROM companies WHERE run_id = ?",[e]),g={};for(const i of Y)g[i]={used:0,turnover_start:0,count:0,withCap:0};for(const i of p){const d=i.initial_turnover||0,w=i.turnover||0,S=g[j(d)];S&&(S.used+=d-w,S.turnover_start+=d,S.count++,w>1&&S.withCap++)}const R=u(t,"SELECT region, total, fully_allocated, partially_allocated, unassigned FROM region_breakdown WHERE run_id = ? ORDER BY region",[e]),f={};for(const i of R)f[i.region]={total:i.total,fully_allocated:i.fully_allocated,partially_allocated:i.partially_allocated,unassigned:i.unassigned};const y=b(t,`SELECT COUNT(*) FROM projects p
     WHERE p.run_id = ? AND p.main_contractor_id IS NOT NULL
     AND NOT EXISTS (
       SELECT 1 FROM project_subs ps
       WHERE ps.run_id = p.run_id AND ps.project_id = p.project_id
     )`,[e]);return{simulation_id:a,year:s,..._||{},projects_without_subcontractor:(_==null?void 0:_.projects_without_subcontractor)??(y||0),heatmap:c,heatmap_total:m,band_utilisation:g,per_region_breakdown:f}}function J(a,n){const{db:r,run_id:t}=v(a,n),e=u(r,`SELECT p.region, p.category,
            SUM(p.paw)            AS total_paw,
            SUM(p.main_allocated) AS total_main,
            COALESCE(SUM(ps.sub_total), 0) AS total_sub,
            SUM(p.remaining_workload) AS total_remaining,
            COUNT(CASE WHEN p.main_contractor_id IS NULL THEN 1 END) AS unassigned_count,
            COUNT(CASE WHEN p.main_contractor_id IS NOT NULL
                       AND COALESCE(ps.sub_total, 0) = 0 THEN 1 END) AS no_sub_count,
            SUM(CASE WHEN p.main_contractor_id IS NULL THEN p.paw
                     WHEN p.remaining_workload > 1   THEN p.remaining_workload
                     ELSE 0 END) AS unalloc_paw,
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
     GROUP BY p.region, p.category`,[t]),_=u(r,`SELECT primary_region, category,
            SUM(initial_turnover) AS total_initial,
            SUM(turnover)         AS total_remaining,
            COUNT(*)              AS count
     FROM companies WHERE run_id = ?
     GROUP BY primary_region, category`,[t]),s=M(r,"projects"),l=u(r,`SELECT project_id, value, paw, category, region, duration,
            ${s} AS start_year
     FROM projects WHERE run_id = ? AND main_contractor_id IS NULL
     ORDER BY value DESC LIMIT 8`,[t]),c=u(r,`SELECT company_id, category, primary_region, initial_turnover, turnover
     FROM companies WHERE run_id = ? AND turnover > 1
     ORDER BY turnover DESC LIMIT 6`,[t]);return{project_agg:e.map(o=>({region:o.region,category:o.category,total_paw:o.total_paw||0,total_main:o.total_main||0,total_sub:o.total_sub||0,total_remaining:o.total_remaining||0,unassigned_count:o.unassigned_count||0,no_sub_count:o.no_sub_count||0,unalloc_paw:o.unalloc_paw||0,total_value:o.total_value||0,unallocated_value:o.unallocated_value||0})),company_agg:_.map(o=>({region:o.primary_region,category:o.category,total_initial:o.total_initial||0,total_remaining:o.total_remaining||0,count:o.count||0})),top_unassigned:l.map(o=>({project_id:o.project_id,value:o.value||0,paw:o.paw||0,category:o.category,region:o.region,duration:o.duration||1,start_year:o.start_year,main_contractor_id:null,main_allocated:0,remaining_workload:o.paw||0,subcontractors:[],status:"unassigned"})),top_spare:c.map(o=>({company_id:o.company_id,category:o.category,primary_region:o.primary_region,region:o.primary_region,initial_turnover:o.initial_turnover||0,turnover:o.turnover||0,size_band:j(o.initial_turnover||0),reach:T(o.initial_turnover||0),in_house_pct:C(o.initial_turnover||0),role:(o.category||"").match(/^E(301|302|310) /)?"main":"sub"}))}}function Q(a,{limit:n=50,offset:r=0,region:t,category:e,status:_,sort:s,order:l,search:c,year:o}={}){const{db:m,run_id:p}=v(a,o),g=M(m,"p");let R=B[s]||"p.value";s==="start_year"&&(R=g);const f=l==="asc"?"ASC":"DESC",y=["p.run_id = $run_id"],i={$run_id:p};t&&(y.push("p.region = $region"),i.$region=t),e&&(y.push("p.category = $category"),i.$category=e),_&&A[_]&&(y.push("p.allocation_status = $status"),i.$status=A[_]),c&&(y.push("CAST(p.project_id AS TEXT) LIKE $search"),i.$search=`%${c}%`);const d=y.join(" AND "),w=u(m,`SELECT p.project_id, p.value, p.category, p.region, p.duration,
            ${g} AS start_year, p.paw,
            p.main_contractor_id, p.main_allocated, p.remaining_workload,
            p.allocation_status,
            (SELECT COUNT(*) FROM project_subs ps WHERE ps.run_id = p.run_id AND ps.project_id = p.project_id) AS sub_count
     FROM projects p
     WHERE ${d}
     ORDER BY ${R} ${f}
     LIMIT $limit OFFSET $offset`,{...i,$limit:n,$offset:r}),S=b(m,`SELECT COUNT(*) FROM projects p WHERE ${d}`,i)||0;return{total:Number(S),limit:n,offset:r,rows:w.map(E=>({project_id:E.project_id,value:E.value,category:E.category,region:E.region,duration:E.duration,start_year:E.start_year,paw:E.paw,main_contractor_id:E.main_contractor_id,main_allocated:E.main_allocated,remaining_workload:E.remaining_workload,allocation_status:E.allocation_status,sub_count:E.sub_count}))}}function aa(a,{limit:n=50,offset:r=0,region:t,category:e,size_band:_,role:s,reach:l,sort:c,order:o,search:m,year:p}={}){const{db:g,run_id:R}=v(a,p),f=I[c]||"initial_turnover",y=o==="asc"?"ASC":"DESC",i=["run_id = $run_id"],d={$run_id:R};if(t&&(i.push("primary_region = $region"),d.$region=t),e&&(i.push("category = $category"),d.$category=e),_&&O[_]){const[H,N]=O[_];i.push("initial_turnover >= $sblo"),d.$sblo=H,N!==null&&(i.push("initial_turnover < $sbhi"),d.$sbhi=N)}l==="National"?i.push("initial_turnover >= 50000000"):l==="Multi-region"?i.push("initial_turnover >= 5000000 AND initial_turnover < 50000000"):l==="Regional"&&i.push("initial_turnover < 5000000"),s==="main"?i.push("(category LIKE 'E301 %' OR category LIKE 'E302 %' OR category LIKE 'E310 %')"):s==="sub"&&i.push("NOT (category LIKE 'E301 %' OR category LIKE 'E302 %' OR category LIKE 'E310 %')"),m&&(i.push("(CAST(company_id AS TEXT) LIKE $search OR category LIKE $search)"),d.$search=`%${m}%`);const w=i.join(" AND "),S=u(g,`SELECT company_id, category, primary_region, initial_turnover,
            turnover, initial_cac, cac, rac, main_awards, sub_awards
     FROM companies WHERE ${w}
     ORDER BY ${f} ${y}
     LIMIT $limit OFFSET $offset`,{...d,$limit:n,$offset:r}),E=b(g,`SELECT COUNT(*) FROM companies WHERE ${w}`,d)||0;return{total:Number(E),limit:n,offset:r,rows:S.map(D)}}function ta(a,n){const{db:r,run_id:t}=v(a),e=u(r,"SELECT main_contractor_id, main_allocated FROM projects WHERE run_id = ? AND project_id = ?",[t,n])[0];if(!e)throw new Error(`Project ${n} not found`);let _=null;if(e.main_contractor_id!=null){const c=u(r,`SELECT company_id, category, primary_region, initial_turnover,
              turnover, initial_cac, cac, rac, main_awards, sub_awards
       FROM companies WHERE run_id = ? AND company_id = ?`,[t,e.main_contractor_id])[0];c&&(_=$(c),_.allocated=e.main_allocated||0)}const l=u(r,`SELECT ps.company_id, ps.amount,
            c.category, c.primary_region, c.initial_turnover,
            c.turnover, c.initial_cac, c.cac, c.rac, c.main_awards, c.sub_awards
     FROM project_subs ps
     JOIN companies c ON c.run_id = ps.run_id AND c.company_id = ps.company_id
     WHERE ps.run_id = ? AND ps.project_id = ?
     ORDER BY ps.amount DESC`,[t,n]).map(c=>{const o=$({company_id:c.company_id,category:c.category,primary_region:c.primary_region,initial_turnover:c.initial_turnover,turnover:c.turnover,initial_cac:c.initial_cac,cac:c.cac,rac:c.rac,main_awards:c.main_awards,sub_awards:c.sub_awards});return o.allocated=c.amount||0,o});return{project_id:n,main:_,subcontractors:l}}function oa(a,n,{role:r="all",limit:t=50,offset:e=0}={}){const{db:_,run_id:s}=v(a);let l=[];const c=M(_,"p");(r==="all"||r==="main")&&(l=l.concat(u(_,`SELECT p.project_id, p.value, p.paw, p.category, p.region,
              ${c} AS start_year,
              'main' AS role, p.main_allocated AS allocated
       FROM projects p WHERE p.run_id = ? AND p.main_contractor_id = ?
       ORDER BY p.main_allocated DESC`,[s,n]))),(r==="all"||r==="sub")&&(l=l.concat(u(_,`SELECT p.project_id, p.value, p.paw, p.category, p.region,
              ${c} AS start_year,
              'sub' AS role, ps.amount AS allocated
       FROM project_subs ps
       JOIN projects p ON p.run_id = ps.run_id AND p.project_id = ps.project_id
       WHERE ps.run_id = ? AND ps.company_id = ?
       ORDER BY ps.amount DESC`,[s,n]))),l.sort((p,g)=>(g.allocated||0)-(p.allocated||0));const o=l.length,m=l.slice(e,e+t);return{total:o,limit:t,offset:e,rows:m.map(p=>({project_id:p.project_id,value:p.value,paw:p.paw,category:p.category,region:p.region,start_year:p.start_year,role:p.role,allocated:p.allocated||0}))}}async function ra(a){const n=L(a);if(!n)throw new Error(`Unknown local simulation: ${a}`);const{db:r}=n,t=k(r),e={};for(const{id:_,year:s}of t){const l=Number(s),c=X(a,l),o=J(a,l);e[l]=G(a,r,_,c,o)}return e}export{J as localGetAgg,aa as localGetCompanies,oa as localGetCompanyProjects,X as localGetDetail,ta as localGetProjectContractors,Q as localGetProjects,ra as localLoadFromApi};
