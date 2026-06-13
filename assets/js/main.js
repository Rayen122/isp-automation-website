/* === PRELOADER === */
document.addEventListener('DOMContentLoaded',()=>{
    document.getElementById('preloader').classList.add('done');

    /* Force autoplay vidéo sur mobile (certains navigateurs bloquent même les vidéos muted) */
    var v=document.querySelector('.hero-video');
    if(v){
        v.play().catch(function(){
            document.addEventListener('touchstart',function h(){v.play();document.removeEventListener('touchstart',h);},{once:true});
        });
    }
});

/* === CUSTOM CURSOR === */
(function(){
    // Sur mobile / écrans tactiles, le curseur est masqué en CSS.
    // On évite donc complètement la boucle d'animation (économie CPU/batterie, moins de lag).
    const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches || window.innerWidth < 1024;
    if(isTouch) return;
    const dot=document.querySelector('.cursor-dot');
    const ring=document.querySelector('.cursor-ring');
    if(!dot||!ring) return;
    let mx=0,my=0,dx=0,dy=0,rx=0,ry=0;
    document.addEventListener('mousemove',e=>{ mx=e.clientX; my=e.clientY; });
    (function loop(){
        dx+=(mx-dx)*.2; dy+=(my-dy)*.2;
        rx+=(mx-rx)*.08; ry+=(my-ry)*.08;
        dot.style.transform=`translate3d(${dx}px, ${dy}px, 0) translate(-50%, -50%)`;
        ring.style.transform=`translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
        requestAnimationFrame(loop);
    })();
    document.querySelectorAll('a,button,.p-card,.bento-card,.about-feat,.c-info-item,.prod-filter').forEach(el=>{
        el.addEventListener('mouseenter',()=>document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave',()=>document.body.classList.remove('cursor-hover'));
    });
})();

/* === SCROLL HANDLER (regroupé + throttlé via requestAnimationFrame) === */
(function(){
    const prog=document.getElementById('scrollProgress');
    const nav=document.getElementById('topNav');
    const back=document.getElementById('backTop');
    let ticking=false;
    function update(){
        const y=window.scrollY;
        const h=document.documentElement.scrollHeight-window.innerHeight;
        if(prog) prog.style.width=(h>0?(y/h)*100:0)+'%';
        if(nav) nav.classList.toggle('scrolled',y>60);
        if(back) back.classList.toggle('show',y>600);
        ticking=false;
    }
    window.addEventListener('scroll',()=>{
        if(!ticking){ requestAnimationFrame(update); ticking=true; }
    },{passive:true});
    update();
})();

/* === THREE.JS HERO (chargé dynamiquement, desktop uniquement) === */
(function(){
    const c=document.getElementById('heroCanvas');
    if(!c || window.innerWidth < 1024) return;

    function initHero(){
        const r=new THREE.WebGLRenderer({canvas:c,alpha:true,antialias:true});
        r.setSize(window.innerWidth,window.innerHeight);
        r.setPixelRatio(Math.min(window.devicePixelRatio,2));
        const scene=new THREE.Scene();
        const cam=new THREE.PerspectiveCamera(60,window.innerWidth/window.innerHeight,.1,1000);
        cam.position.z=40;

        const N=1200, pos=new Float32Array(N*3), col=new Float32Array(N*3);
        for(let i=0;i<N*3;i+=3){
            pos[i]=(Math.random()-.5)*120; pos[i+1]=(Math.random()-.5)*120; pos[i+2]=(Math.random()-.5)*60;
            const t=Math.random();
            if(t<.4){ col[i]=.78; col[i+1]=.063; col[i+2]=.18; }
            else{ col[i]=.35; col[i+1]=.35; col[i+2]=.42; }
        }
        const pg=new THREE.BufferGeometry();
        pg.setAttribute('position',new THREE.BufferAttribute(pos,3));
        pg.setAttribute('color',new THREE.BufferAttribute(col,3));
        const pm=new THREE.PointsMaterial({size:.12,vertexColors:true,transparent:true,opacity:.5,sizeAttenuation:true});
        const pts=new THREE.Points(pg,pm);
        scene.add(pts);

        const geos=[
            new THREE.TorusKnotGeometry(3,.6,80,12),
            new THREE.IcosahedronGeometry(4,1),
            new THREE.OctahedronGeometry(3,0)
        ];
        const meshes=[];
        for(let i=0;i<geos.length;i++){
            const mat=new THREE.MeshBasicMaterial({
                color:i===0?0xC8102E:0x4A4A5A,wireframe:true,transparent:true,opacity:.03
            });
            const m=new THREE.Mesh(geos[i],mat);
            m.position.set((i-1)*30,(Math.random()-.5)*15,(Math.random()-.5)*20);
            m.userData={rx:(Math.random()-.5)*.002,ry:(Math.random()-.5)*.003};
            meshes.push(m); scene.add(m);
        }

        let mx=0,my=0;
        document.addEventListener('mousemove',e=>{
            mx=(e.clientX/window.innerWidth-.5)*2;
            my=(e.clientY/window.innerHeight-.5)*2;
        });

        let isHeroVisible=true;
        if('IntersectionObserver' in window){
            new IntersectionObserver(entries=>{ isHeroVisible=entries[0].isIntersecting; },{threshold:0})
                .observe(document.getElementById('hero'));
        }

        (function anim(){
            requestAnimationFrame(anim);
            if(!isHeroVisible) return;
            pts.rotation.y+=.00015; pts.rotation.x+=.00008;
            meshes.forEach(m=>{m.rotation.x+=m.userData.rx;m.rotation.y+=m.userData.ry;});
            cam.position.x+=(mx*3-cam.position.x)*.01;
            cam.position.y+=(-my*2-cam.position.y)*.01;
            cam.lookAt(scene.position);
            r.render(scene,cam);
        })();

        window.addEventListener('resize',()=>{
            cam.aspect=window.innerWidth/window.innerHeight;
            cam.updateProjectionMatrix();
            r.setSize(window.innerWidth,window.innerHeight);
        });
    }

    // Injecter Three.js uniquement maintenant qu'on sait qu'on est sur desktop
    const s=document.createElement('script');
    s.src='https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    s.onload=initHero;
    document.head.appendChild(s);
})();

/* === NAV === */
function toggleM(){
    document.getElementById('navMenu').classList.toggle('open');
    const burger = document.getElementById('burger');
    burger.classList.toggle('active');
    burger.setAttribute('aria-expanded', String(burger.classList.contains('active')));
}
function closeM(){
    document.getElementById('navMenu').classList.remove('open');
    const burger = document.getElementById('burger');
    burger.classList.remove('active');
    burger.setAttribute('aria-expanded', 'false');
}

/* === SCROLL REVEAL === */
const ro=new IntersectionObserver((entries)=>{
    entries.forEach((entry,i)=>{
        if(entry.isIntersecting){
            setTimeout(()=>entry.target.classList.add('show'),i*60);
            ro.unobserve(entry.target);
        }
    });
},{threshold:.1});
document.querySelectorAll('.rv,.rv-left,.rv-right').forEach(el=>ro.observe(el));

/* === BENTO CARD MOUSE TRACK === */
document.querySelectorAll('.bento-card').forEach(card=>{
    card.addEventListener('mousemove',e=>{
        const r=card.getBoundingClientRect();
        const x=((e.clientX-r.left)/r.width)*100;
        const y=((e.clientY-r.top)/r.height)*100;
        card.style.setProperty('--mouse-x',x+'%');
        card.style.setProperty('--mouse-y',y+'%');
    });
});

/* === PRODUCT FILTER === */
document.querySelectorAll('.prod-filter').forEach(btn=>{
    btn.addEventListener('click',()=>{
        document.querySelectorAll('.prod-filter').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        const cat=btn.dataset.cat;
        document.querySelectorAll('.p-card').forEach((c,i)=>{
            if(cat==='all'||c.dataset.cat===cat){
                c.style.display='';
                setTimeout(()=>{c.style.opacity='1';c.style.transform='';},i*30);
            } else {
                c.style.opacity='0';c.style.transform='scale(0.95) translateY(10px)';
                setTimeout(()=>c.style.display='none',400);
            }
        });
    });
});

/* === 3D TILT CARDS === */
document.querySelectorAll('.p-card').forEach(card=>{
    card.addEventListener('mousemove',e=>{
        const r=card.getBoundingClientRect();
        const x=e.clientX-r.left,y=e.clientY-r.top;
        const rx=(y-r.height/2)/25,ry=(r.width/2-x)/25;
        card.style.transform=`perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-12px)`;
    });
    card.addEventListener('mouseleave',()=>{card.style.transform='';});
});

/* === SMOOTH SCROLL === */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',function(e){
        e.preventDefault();
        const t=document.querySelector(this.getAttribute('href'));
        if(t) t.scrollIntoView({behavior:'smooth',block:'start'});
    });
});

/* === TOUCH ANIMATIONS (mobile) === */
(function(){
    if(!('ontouchstart' in window)) return;
    var els=document.querySelectorAll('.btn-primary,.btn-outline,.btn-send,.p-card,.bento-card,.about-feat,.c-info-item,.prod-filter,.p-card-link,.footer-socials a,.back-top');
    els.forEach(function(el){
        el.addEventListener('touchstart',function(){
            el.classList.add('touched');
        },{passive:true});
        el.addEventListener('touchend',function(){
            setTimeout(function(){ el.classList.remove('touched'); },600);
        },{passive:true});
    });
})();

/* === FORM === */
function sendForm(e){
    e.preventDefault();
    const nom     = document.getElementById('cf-nom').value.trim();
    const societe = document.getElementById('cf-societe').value.trim();
    const email   = document.getElementById('cf-email').value.trim();
    const tel     = document.getElementById('cf-tel').value.trim();
    const sujet   = document.getElementById('cf-sujet').value.trim() || 'Demande de contact';
    const message = document.getElementById('cf-message').value.trim();

    const corps =
        'Nom : ' + nom + '\n' +
        (societe ? 'Societe : ' + societe + '\n' : '') +
        'Email : ' + email + '\n' +
        (tel ? 'Telephone : ' + tel + '\n' : '') +
        '\nMessage :\n' + message;

    const mailto = 'mailto:ispautomation@yahoo.fr'
        + '?subject=' + encodeURIComponent('[ISP Site] ' + sujet)
        + '&body='    + encodeURIComponent(corps);

    window.location.href = mailto;

    const b = document.getElementById('btnSend');
    b.innerHTML = '<i class="fas fa-check"></i> Client mail ouvert !';
    b.style.background = '#16a34a';
    setTimeout(()=>{
        b.innerHTML = 'Envoyer le message <i class="fas fa-paper-plane"></i>';
        b.style.background = '';
        e.target.reset();
    }, 4000);
}