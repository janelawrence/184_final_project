#version 330

// (Every uniform is available here.)

uniform mat4 u_view_projection;
uniform mat4 u_model;

uniform float u_normal_scaling;
uniform float u_height_scaling;

uniform vec3 u_cam_pos;
uniform vec3 u_light_pos;
uniform vec3 u_light_intensity;

// Feel free to add your own textures. If you need more than 4,
// you will need to modify the skeleton.
uniform sampler2D u_texture_1;
uniform sampler2D u_texture_2;
uniform sampler2D u_texture_3;
uniform sampler2D u_texture_4;

uniform samplerCube u_texture_cubemap;
uniform vec2 u_texture_4_size;


in vec4 v_position;
in vec4 v_normal;
in vec4 v_tangent;
in vec2 v_uv;

out vec4 out_color;

float h(vec2 uv) {
  // You may want to use this helper function...
  return texture(u_texture_2, uv)[0];
}

float h2(vec2 uv) {
  // You may want to use this helper function...
  return texture(u_texture_4, uv)[0];
}

void main() {
  // YOUR CODE HERE
  vec3 wo = u_cam_pos - vec3(v_position);
  vec3 wi = 2 * vec3(v_normal) - wo;


    //Bumping
   vec3 b = cross(vec3(v_normal), vec3(v_tangent));
  mat3 tbn = mat3(vec3(v_tangent), b, vec3(v_normal));


  float u = v_uv[0];
  float v = v_uv[1];
  float width = u_texture_4_size[0];
  float height = u_texture_4_size[1];

  float du = (h2(vec2(u + 1/width, v)) - h2(v_uv)) * u_height_scaling * u_normal_scaling;
  float dv = (h2(vec2(u, v + 1/height)) - h2(v_uv)) * u_height_scaling * u_normal_scaling;
  vec3 n0 = vec3(-du, -dv, 1);

  vec3 nd = tbn * n0;


  vec4 l_vec = vec4(u_light_pos, 1.0) - v_position;
  float cos_theta1 = dot(normalize(l_vec), normalize(vec4(nd, 0.0)));

  vec4 to_cam = vec4(u_cam_pos, 1.0) - v_position;
  vec4 h = (to_cam + l_vec) / 2;
  float cos_theta2 = dot(normalize(vec4(nd, 0.0)), normalize(h));
  float r = length(l_vec);


  float k_d = 1;
  float k_a = 0.15;
  vec3 i_a = vec3(0.15, 0.15, 0.15);
  float k_s = 0.5;
  float p = 20;

  vec3 l_d = k_d * u_light_intensity/(r*r) * max(0, cos_theta1);
  vec3 l_a = k_a * i_a;
  vec3 l_s = k_s * u_light_intensity/(r*r) * pow(max(0, cos_theta2), p);

  vec4 out_color3;
  out_color3 = vec4(l_a+l_d+l_s, out_color.a);

    //refraction
  vec3 wi_reflect = 2 * vec3(v_normal) - wo;
  vec3 wi_refract;
  float eta = 1.0/1.33;
  float temp = 1 - eta * eta * (1 - wo.z * wo.z);
    
  if (temp < 0) { //cos_theta = wo.z
        out_color = 0.3* texture(u_texture_4, vec2(wi_reflect)) + texture(u_texture_cubemap, wi);
        out_color.a = 0.5;
        return;
  }
  wi_refract.z = wo.z < 0? sqrt(temp): -sqrt(temp); //cos_theta_prime = wi.z
  wi_refract.x = - eta * wo.x;
  wi_refract.y = - eta * wo.y;
   //sand bottom
  //vec4 out_color2 = texture(u_texture_4, vec2(wi_refract));

  //Stone bottom
  vec4 out_color2 = texture(u_texture_3, vec2(wi_refract));


  //out_color = out_color2;
  //reflection and refraction
  out_color = 0.15 * out_color2 + texture(u_texture_cubemap, wi);
  //out_color = 0.05 * out_color3 +  0.15 *out_color2 + texture(u_texture_cubemap, wi);
  //out_color = texture(u_texture_cubemap, wi);
  out_color.a = 0.5;
}
