#ifndef CLOTH_H
#define CLOTH_H

#include <unordered_set>
#include <unordered_map>
#include <vector>

#include "CGL/CGL.h"
#include "CGL/misc.h"
#include "clothMesh.h"
#include "collision/collisionObject.h"
#include "spring.h"
#include "waveSurface.h"
#include "CGL/vector3D.h"
#include "CGL/vector2D.h"


using namespace CGL;
using namespace std;

enum e_orientation { HORIZONTAL = 0, VERTICAL = 1 };

struct ClothParameters {
  ClothParameters() {}
  ClothParameters(bool enable_structural_constraints,
                  bool enable_shearing_constraints,
                  bool enable_bending_constraints, double damping,
                  double density, double ks)
      : enable_structural_constraints(enable_structural_constraints),
        enable_shearing_constraints(enable_shearing_constraints),
        enable_bending_constraints(enable_bending_constraints),
        damping(damping), density(density), ks(ks) {}
  ~ClothParameters() {}

  // Global simulation parameters

  bool enable_structural_constraints;
  bool enable_shearing_constraints;
  bool enable_bending_constraints;

  double damping;

  // Mass-spring parameters
  double density;
  double ks;
  //int numWaves = 4;
  //double steepness = 0.2;
  //  vector<double> wavelength{0.5, 0.5, 0.5, 0.2, 0.05};
  //  vector<double> amplitude{0.02, 0.002, 0.002, 0.001, 0.008};
  //  vector<double> speed{0.2, 0.4, 0.2, 0.3, 0.5};
  //  vector<Vector2D> direction{Vector2D(2, 1), Vector2D(2, 1), Vector2D(1, 1), Vector2D(1, 1.5), Vector2D(2, 1)};


    int numWaves = 2;
    double steepness = 0.0;
    vector<double> wavelength{ 0.5, 0.5, 0.5, 0.2, 0.05 };
    vector<double> amplitude{ 0.02, 0.002, 0.002, 0.001, 0.008 };
    vector<double> speed{ 0.2, 0.4, 0.2, 0.3, 0.5 };
    vector<Vector2D> direction{ Vector2D(2, 1), Vector2D(2, 1), Vector2D(1, 1), Vector2D(1, 1.5), Vector2D(2, 1) };
};

struct Cloth {
  Cloth() {}
  Cloth(double width, double height, int num_width_points,
        int num_height_points, float thickness);
  ~Cloth();

  void buildGrid();

  void simulate(double frames_per_sec, double simulation_steps, ClothParameters *cp,
                vector<Vector3D> external_accelerations,
                vector<CollisionObject *> *collision_objects);

  void reset();
  void buildClothMesh();

  void build_spatial_map();
  void self_collide(PointMass &pm, double simulation_steps);
  float hash_position(Vector3D pos);

  // Cloth properties
  double width;
  double height;
  int num_width_points;
  int num_height_points;
  double thickness;
  e_orientation orientation;

  // Cloth components
  vector<PointMass> point_masses;
  WaveSurface wavesurface;
  vector<vector<int>> pinned;
  vector<Spring> springs;
  ClothMesh *clothMesh;

  // Spatial hashing
  unordered_map<float, vector<PointMass *> *> map;

  // Add accumulated time
  double time = 0;
};

#endif /* CLOTH_H */
