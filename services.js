/* services.js - extracted from services.html
   Contains Three.js background animation and UI reveal/parallax logic.
*/
(function(){
  function initThreeJS(){
    const container = document.getElementById('threejs-container-ANIMATION_19');
    if(!container || typeof THREE === 'undefined') return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000);
    camera.position.z = 15;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.appendChild(renderer.domElement);

    // Nodes
    const nodeCount = 80; const nodes = [];
    const nodeGeometry = new THREE.SphereGeometry(0.12, 8, 8);
    const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0xA855F7 });
    for(let i=0;i<nodeCount;i++){
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      node.position.set((Math.random()-0.5)*35, (Math.random()-0.5)*25, (Math.random()-0.5)*20);
      node.velocity = new THREE.Vector3((Math.random()-0.5)*0.015, (Math.random()-0.5)*0.015, (Math.random()-0.5)*0.015);
      scene.add(node); nodes.push(node);
    }

    const lineMaterial = new THREE.LineBasicMaterial({ color:0x4F7FFF, transparent:true, opacity:0.2 });
    let lines;
    function updateLines(){
      if(lines) scene.remove(lines);
      const positions = [];
      const maxDist = 7;
      for(let i=0;i<nodeCount;i++){
        for(let j=i+1;j<nodeCount;j++){
          const dist = nodes[i].position.distanceTo(nodes[j].position);
          if(dist < maxDist){
            positions.push(nodes[i].position.x, nodes[i].position.y, nodes[i].position.z);
            positions.push(nodes[j].position.x, nodes[j].position.y, nodes[j].position.z);
          }
        }
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      lines = new THREE.LineSegments(geometry, lineMaterial);
      scene.add(lines);
    }

    // Floating spheres
    const sphereGroup = new THREE.Group();
    for(let i=0;i<6;i++){
      const geo = new THREE.SphereGeometry(Math.random()*3+1.5, 32, 32);
      const mat = new THREE.MeshPhongMaterial({ color:0xA855F7, transparent:true, opacity:0.08, wireframe:true });
      const s = new THREE.Mesh(geo, mat);
      s.position.set((Math.random()-0.5)*45, (Math.random()-0.5)*35, (Math.random()-0.5)*25);
      sphereGroup.add(s);
    }
    scene.add(sphereGroup);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xA855F7, 2, 60); pointLight.position.set(10,10,10); scene.add(pointLight);

    let mouseX=0, mouseY=0;
    window.addEventListener('mousemove', (e)=>{ mouseX = (e.clientX/window.innerWidth - 0.5)*2; mouseY = (e.clientY/window.innerHeight - 0.5)*2; });

    function animate(){
      requestAnimationFrame(animate);
      nodes.forEach(node => { node.position.add(node.velocity); if(Math.abs(node.position.x)>18) node.velocity.x*=-1; if(Math.abs(node.position.y)>13) node.velocity.y*=-1; if(Math.abs(node.position.z)>10) node.velocity.z*=-1; });
      updateLines();
      sphereGroup.rotation.y += 0.0015; sphereGroup.children.forEach(s=>s.rotation.x += 0.0025);
      camera.position.x += (mouseX*3 - camera.position.x)*0.05; camera.position.y += (-mouseY*3 - camera.position.y)*0.05;
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    }

    window.addEventListener('resize', ()=>{ const w = container.clientWidth || window.innerWidth; const h = container.clientHeight || window.innerHeight; camera.aspect = w/h; camera.updateProjectionMatrix(); renderer.setSize(w,h); });

    animate();
  }

  function initUI(){
    const observerOptions = { threshold:0.1, rootMargin:'0px 0px -100px 0px' };
    const observer = new IntersectionObserver((entries)=>{ entries.forEach(entry=>{ if(entry.isIntersecting) entry.target.classList.add('active'); }); }, observerOptions);
    document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

    window.addEventListener('scroll', ()=>{
      const scrolled = window.pageYOffset;
      const bg = document.querySelector('threejs-scene');
      if(bg) bg.style.transform = `translateY(${scrolled * 0.15}px)`;
    });
  }

  document.addEventListener('DOMContentLoaded', ()=>{ initThreeJS(); initUI(); });
})();
