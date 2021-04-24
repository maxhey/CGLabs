/* global subd, THREE, size, scene, material_tissue, dat */
var ambientlight;
var cameralight;

var mtlLoader = new THREE.MTLLoader();
var gifLoader = new GifLoader();
mtlLoader.setTexturePath("models/");
mtlLoader.setPath("models/");
gifLoader.setPath("models/");

//Load a texture object and traverse the texture geometry then apply the combined matrices to the mesh
function loadTexture(loader, object) { 
      loader.load(object, function(mesh)
      {
         var CenterBB;
         var SizeBB;
         mesh.traverse(function ( child )
         {
             if ( child instanceof THREE.Mesh )
             {
                 var mygeometry = new THREE.Geometry().fromBufferGeometry( child.geometry );
                 mygeometry.computeBoundingBox();
                 child.material.color= new THREE.Color(1,1,1);
                 CenterBB=mygeometry.boundingBox.getCenter();
                 SizeBB=mygeometry.boundingBox.getSize();
             }
         });
         scene.add(mesh);
         var sca = new THREE.Matrix4();
         var tra = new THREE.Matrix4();
         var combined = new THREE.Matrix4();
   
         sca.makeScale(20/SizeBB.length(),20/SizeBB.length(),20/SizeBB.length());
         tra.makeTranslation (-CenterBB.x,-CenterBB.y,-CenterBB.z);
         combined.multiply(sca);
         combined.multiply(tra);
   
         mesh.applyMatrix(combined);
       });
}

//Create texture object from file
function createObj(objmtl, object) {
    mtlLoader.load(objmtl, function(materials)
    {
      materials.preload();
      var loader = new THREE.OBJLoader();
      loader.setPath( "models/" );
      loader.setMaterials(materials);
      loadTexture(loader, object);
    });
}

function loadGif(object) {
        // resource URL
        gifLoader.load("textruegif.gif", function(materials)
        {
            materials.preload();
            var loader = new THREE.OBJLoader();
            loader.setPath("models/");
            loader.setMaterials(materials);
            loadTexture(loader, object);
        });
}

function addLight() {
    cameralight = new THREE.PointLight(new THREE.Color(1, 1, 1), 0.5);
    cameralight.castShadow = true;
    ambientlight = new THREE.AmbientLight(new THREE.Color(1, 1, 1), 0.2);
    camera.add(cameralight);
}

//Add all shapes to the scene
function addShapes() {
    //createObj("Librarian.obj.mtl", "Librarian.obj");
    loadGif("Librarian.obj");
    addLight();
    scene.add(camera);
    scene.add(ambientlight);
}