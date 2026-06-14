(function() {
  const mount = document.getElementById("metadata_graph_app");

  if (!mount) {
    return;
  }

  const svg_ns = "http://www.w3.org/2000/svg";

  const state = {
    data: null,
    x_field: "",
    y_field: "",
    min_count: 1,
    selected: null,
    hovered: null,
    graph: null,
    colour_field: "",
    colour_map: new Map(),
    same_title_components: [],
    same_title_component_by_node: new Map(),
    component_edge_counts: new Map()
  };

  // ============================================================================
  // Force graph tuning
  // ============================================================================

  const graph_settings = {
    /*
      Whether the graph keeps a small amount of motion after it has settled.

      true gives a lightly living graph.
      false lets the graph stop when the nodes are at rest.

      For the current hybrid metadata explorer, false is the calmer default.
    */
    ambient_motion: false,

    /*
      Idle simulation energy used only when ambient_motion is enabled.

      Higher values keep the graph visibly moving.
      Lower values make any ambient motion subtler.

      Suggested range: 0.003 to 0.03.
    */
    idle_alpha: 0.01,

    /*
      Energy restored when the graph is first shown or rebuilt.

      Higher values make the initial layout move more dramatically.
      Lower values make the graph settle with less visible motion.

      Suggested range: 0.25 to 0.8.
    */
    view_reheat: 0.42,

    /*
      Energy restored when the graph is reset.

      Higher values make reset more animated.
      Lower values make reset calmer.

      Suggested range: 0.3 to 0.9.
    */
    reset_reheat: 0.68,


    /*
      Duration, in milliseconds, of the stronger layout kick used after graph
      load or reset.

      Higher values make reset/start spread the graph more aggressively.
      Lower values make the kick subtler and shorter.
    */
    reset_kick_duration_ms: 560,

    /*
      Temporary repulsion multiplier during the reset/start kick.

      Higher values spread unrelated nodes apart faster at the beginning.
      Lower values keep reset calmer.
    */
    reset_kick_charge_multiplier: 2.1,

    /*
      Temporary link-attraction multiplier during the reset/start kick.

      Higher values pull connected clusters together faster at the beginning.
      Lower values keep linked nodes more elastic from the start.
    */
    reset_kick_link_multiplier: 2.15,

    /*
      Energy restored while a node is dragged.

      Higher values make surrounding nodes react more.
      Lower values keep dragging more sluggish and local.

      Suggested range: 0.08 to 0.35.
    */
    drag_reheat: 0.22,

    /*
      Additional pull applied to neighbours while a node is actively dragged.

      This keeps ordinary graph movement calm while making dragged clusters
      respond faster and feel less heavy under the pointer.
    */
    drag_link_multiplier: 2.15,
    drag_charge_multiplier: 1.25,

    /*
      Compact spawn radius for new or reset graph layouts.

      Nodes begin close to the central graph point, then expand outward under
      link and repel forces. This avoids the graph appearing scattered before
      it has settled.
    */
    spawn_radius_min: 10,
    spawn_radius_max: 86,
    spawn_jitter: 12,

    /*
      Energy restored when filtering changes which relationships are visible.

      Higher values make nodes visibly rearrange after a threshold change.
      Lower values make posts/edges pop in and out with less layout motion.

      Suggested range: 0.06 to 0.3.
    */
    filter_reheat: 0.1,

    /*
      Energy restored after the graph viewport is resized.

      Higher values let the layout re-settle after sidebar or window changes.
      Lower values preserve the current arrangement more strictly.

      Suggested range: 0.03 to 0.18.
    */
    resize_reheat: 0.055,

    /*
      Cooling rate per animation frame.

      Closer to 1 lets the graph settle for longer.
      Lower values make the graph stop sooner.

      Suggested range: 0.94 to 0.985.
    */
    alpha_decay: 0.965,

    /*
      Cooling rate while a node is actively being dragged.

      Closer to 1 keeps nearby nodes responding during the drag.
      Lower values makes the layout cool more quickly while dragging.
    */
    drag_alpha_decay: 0.99,

    /*
      Simulation energy below which the graph may be considered at rest.

      Higher values stop the graph sooner.
      Lower values let tiny movements resolve for longer.

      Suggested range: 0.001 to 0.01.
    */
    rest_alpha: 0.004,

    /*
      Squared node speed below which a node counts as still.

      Higher values stop sooner but may leave slight visible drift.
      Lower values require nodes to become more completely still.

      Suggested range: 0.0005 to 0.01.
    */
    rest_velocity_sq: 0.0018,

    /*
      Velocity damping.

      Lower values make nodes feel heavier and more sluggish.
      Higher values make nodes glide and bounce more.

      Suggested sluggish range: 0.62 to 0.76.
    */
    velocity_decay: 0.66,

    /*
      Mouse-wheel zoom sensitivity.

      Lower values make wheel zoom slower and smoother.
      Higher values make zoom more responsive but easier to overshoot.

      Suggested range: 0.0005 to 0.002.
    */
    wheel_zoom_sensitivity: 0.00065,

    /*
      Zoom multiplier used by the + and - toolbar buttons.

      1.10 = gentle.
      1.20 = moderate.
      1.35 = fast.
    */
    button_zoom_step: 1.1,

    /*
      Minimum and maximum zoom.

      Lower min_zoom lets the user zoom further out.
      Higher max_zoom lets the user inspect labels more closely.
    */
    min_zoom: 0.25,
    max_zoom: 3,

    /*
      Preferred distance between linked nodes.

      Higher values create more open space between related nodes.
      Lower values make clusters tighter.

      Suggested Obsidian-like range: 160 to 240.
    */
    link_distance: 185,

    /*
      Extra shortening applied to stronger links.

      Higher values pull high-count relationships closer together.
      Lower values keeps link distance more uniform.
    */
    link_count_distance_reduction: 1.4,
    link_min_distance: 145,

    /*
      Shorter target distance for edges where both endpoints have only one
      visible connection.

      Lower values keep one-to-one pairs compact.
      Higher values let isolated pairs spread further apart.

      Suggested range: 45 to 100.
    */
    leaf_pair_link_distance: 76,

    /*
      Target distance for edges attached to one low-degree leaf node.

      Lower values keep leaves close to hubs.
      Higher values create larger star-like clusters around hubs.

      Suggested range: 70 to 130.
    */
    leaf_link_distance: 104,

    /*
      Strength of attraction between linked nodes.

      Higher values make links pull harder and can feel springy.
      Lower values make the graph calmer and heavier.

      Suggested sluggish range: 0.006 to 0.018.
    */
    link_strength: 0.014,
    link_count_strength: 0.0014,
    link_max_strength_bonus: 0.012,

    /*
      Link strength used when an edge is attached to a low-degree leaf node.

      Higher values make leaves cling more tightly to their anchor.
      Lower values allow one-to-one pairs and leaves to drift more freely.

      Suggested range: 0.02 to 0.06.
    */
    leaf_link_strength: 0.033,

    /*
      Target distance for dashed edges linking title nodes that share the same
      visible title but belong to different post slugs.

      Lower values keep duplicate-title posts close.
      Higher values lets them separate more like ordinary graph nodes.
    */
    same_title_link_distance: 85,

    /*
      Attraction strength for dashed same-title edges.

      This should be strong enough to show the semantic relationship, but
      weaker than the initial kick so duplicate titles do not collapse into
      one visual point.
    */
    same_title_link_strength: 0.026,

    /*
      Repulsion between all nodes.

      Higher values spread nodes out more aggressively.
      Lower values allows denser clusters.

      Increase carefully; excessive charge can make the graph explosive.
    */
    charge_strength: 900,
    charge_min_distance_sq: 90,
    charge_max_impulse: 2.6,

    /*
      Repulsion used for low-degree leaf nodes.

      Lower values stop leaves from pushing the whole graph apart.
      Higher values make leaves claim more space around their anchor.

      Suggested range: 150 to 450.
    */
    leaf_charge_strength: 210,

    /*
      Repulsion between directly linked nodes.

      Lower values let connected nodes stay close while still preventing
      overlap. Increase if linked nodes collapse into each other.

      Suggested range: 180 to 500.
    */
    linked_charge_strength: 210,

    /*
      Repulsion between nodes that do not share a visible edge.

      Higher values push unrelated clusters apart and reduce visual noise.
      Lower values make the graph more compact.

      Suggested range: 1000 to 2200.
    */
    unlinked_charge_strength: 1280,

    /*
      Whether nodes with no visible relationships are hidden in the force graph.

      true keeps the graph focused on relationships.
      false keeps all compared metadata values visible, even when isolated.

      Selected nodes remain visible either way.
    */
    hide_isolated_nodes: true,

    /*
      Gentle extra pull toward connected coloured category nodes.

      Higher values create clearer clusters around the smaller metadata field.
      Lower values leaves clustering mostly to edge forces.

      Suggested range: 0 to 0.01.
    */
    colour_cluster_strength: 0.0022,

    /*
      Gentle pull for selected isolated nodes with no visible relationships.

      Higher values keep a selected isolated node closer to the centre.
      Lower values lets it remain where it was when filtered out.
    */
    isolated_node_centre_strength: 0.0032,

    /*
      Gentle pull toward the centre of the graph world.

      Higher values keep the graph compact.
      Lower values allow a more spacious, drifting layout.
    */
    centre_strength: 0.00115,

    /*
      Extra collision spacing around nodes and labels.

      Higher values reduce overlaps and create more negative space.
      Lower values allow tighter packing.
    */
    collision_padding: 26,
    label_collision_strength: 1.65,
    label_collision_max_bonus: 54,
    collision_strength: 0.82,

    /*
      Soft boundary behaviour.

      wall_padding decides how close nodes get to the viewport edge before
      their velocity is damped. wall_velocity_decay controls how strongly they
      slow down near that boundary.
    */
    wall_padding: 42,
    wall_return_strength: 0.018,
    wall_far_multiplier: 2.25,
    wall_velocity_decay: 0.58,

    /*
      Minimum visible node radius.

      Higher values make leaf nodes easier to select.
      Lower values keep the graph more dot-like.

      Suggested Obsidian-like range: 3 to 5.
    */
    node_min_radius: 3.5,

    /*
      Base radius for ordinary low-degree graph nodes.

      Higher values make all nodes more prominent.
      Lower values make the graph more Obsidian-like and dot-based.

      Suggested Obsidian-like range: 3 to 6.
    */
    node_radius: 4,

    /*
      Radius added according to visible graph degree.

      Higher values make highly connected hubs stand out more.
      Lower values keep all node sizes more similar.

      Suggested range: 0.6 to 2.2.
    */
    node_degree_radius_scale: 1.15,

    /*
      Maximum node radius.

      Higher values make hubs more visually dominant.
      Lower values prevents the graph becoming a bubble chart.
    */
    node_max_radius: 10,

    /*
      How strongly larger nodes increase their repulsion.

      Higher values create more space around hubs.
      Lower values keeps repulsion more uniform across node sizes.

      Suggested range: 0.25 to 0.9.
    */
    radius_charge_scale: 0.45,

    /*
      Gap between a node circle and its label.

      Higher values create more breathing room.
      Lower values make labels sit closer to the dot.
    */
    node_label_gap: 8,

    /*
      Zoom level where node labels begin to appear.

      Higher values keep the zoomed-out graph cleaner.
      Lower values show labels earlier.
    */
    node_label_visible_zoom: 0.9,
    node_label_fade_range: 0.35,

    /*
      Zoom level where node post-count text begins to appear.

      Keep this higher than node_label_visible_zoom if labels should matter
      more than counts.
    */
    node_count_visible_zoom: 1.35,
    node_count_fade_range: 0.35,

    /*
      Font weight for node count text.

      400 is normal. Higher values make counts more prominent.
    */
    node_count_font_weight: 400,

    /*
      Visible edge stroke width.

      Higher values make relationship lines more prominent.
      Lower values make the graph quieter and more Obsidian-like.

      Suggested Obsidian-like range: 0.5 to 1.4.
    */
    edge_stroke_width: 0.85,

    /*
      Connected edge stroke width.

      Used for edges related to the selected node or selected edge.
      Higher values make selected neighbourhoods easier to read.
    */
    edge_connected_stroke_width: 1.4,

    /*
      Selected edge stroke width.

      Used for the directly selected relationship.
      Higher values make the selected relationship more obvious.
    */
    edge_selected_stroke_width: 2.1,

    /*
      Invisible edge hit-area width.

      This does not affect visible appearance. It only makes thin edges easier
      to click or tap.

      Suggested range: 12 to 28.
    */
    edge_hit_stroke_width: 20,

    /*
      Minimum zoom level where invisible edge hit areas become interactive.

      Higher values make zoomed-out panning easier because dense edge hit
      areas stop capturing pointer events.
      Lower values make edges selectable from further away.

      Suggested range: 0.75 to 1.2.
    */
    edge_interaction_min_zoom: 0.9,

    /*
      Zoom level where selected or connected edge count labels begin to appear.

      Higher values keep the graph cleaner until the user zooms in closer.
      Lower values reveal shared-post counts earlier.
    */
    edge_label_visible_zoom: 1.7,
    edge_label_fade_range: 0.35,

    /*
      Font size, in SVG user units, for close-zoom edge count labels.

      Higher values make relationship counts easier to read but more visually
      dominant. Lower values keep labels quieter.
    */
    edge_label_font_size: 10,

    /*
      Pointer movement threshold before a click becomes a drag.

      Higher values make selection easier without accidental drags.
      Lower values make panning and node dragging begin more immediately.
    */
    drag_threshold_px: 4,

    /*
      Padding used by the Fit button.

      Larger values leave more space around the fitted graph.
    */
    fit_padding: 56,
    fit_max_zoom: 2.4
  };

  function escape_html(value) {
    return String(value || "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function graph_edge_key(a, b) {
    return [String(a || ""), String(b || "")].sort().join("--");
  }

  function by_id(items) {
    const map = new Map();

    items.forEach(function(item) {
      map.set(item.id, item);
    });

    return map;
  }

  function prefers_reduced_motion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function field_options() {
    return state.data.fields.filter(function(field) {
      return state.data.nodes.some(function(node) {
        return node.field === field.key;
      });
    });
  }

  function nodes_for_field(field_key) {
    return state.data.nodes
        .filter(function(node) {
          return node.field === field_key;
        })
        .sort(function(a, b) {
          if (b.post_count !== a.post_count) {
            return b.post_count - a.post_count;
          }

          const label_difference = a.label.localeCompare(b.label);

          if (label_difference !== 0) {
            return label_difference;
          }

          return String(a.id || "").localeCompare(String(b.id || ""));
        });
  }

  function field_label(field_key) {
    const field = state.data.fields.find(function(item) {
      return item.key === field_key;
    });

    return field ? field.label : field_key;
  }

  function selected_fields_valid() {
    const fields = field_options().map(function(field) {
      return field.key;
    });

    return fields.includes(state.x_field) && fields.includes(state.y_field) && state.x_field !== state.y_field;
  }

  function choose_initial_fields() {
    const fields = field_options();
    const keys = fields.map(function(field) {
      return field.key;
    });

    state.x_field = keys.includes("type") ? "type" : keys[0] || "";
    state.y_field = keys.includes("tags") && state.x_field !== "tags"
        ? "tags"
        : keys.find(function(key) {
          return key !== state.x_field;
        }) || "";
  }

  function edge_matches_fields(edge, nodes) {
    const source = nodes.get(edge.source);
    const target = nodes.get(edge.target);

    if (!source || !target) {
      return false;
    }

    return (
      (source.field === state.x_field && target.field === state.y_field) ||
      (source.field === state.y_field && target.field === state.x_field)
    );
  }

  function edge_relationship_type(edge) {
    return edge && edge.relationship_type || "shared_metadata";
  }

  function is_same_title_edge(edge) {
    return edge_relationship_type(edge) === "same_title";
  }

  function is_shared_metadata_edge(edge) {
    return edge_relationship_type(edge) === "shared_metadata";
  }

  function relationship_edges() {
    const nodes = by_id(state.data.nodes);

    return state.data.edges.filter(function(edge) {
      return is_shared_metadata_edge(edge) && edge_matches_fields(edge, nodes);
    });
  }

  function force_edge_matches_current_nodes(edge, visible_node_ids, nodes) {
    if (!edge || !visible_node_ids.has(edge.source) || !visible_node_ids.has(edge.target)) {
      return false;
    }

    if (is_same_title_edge(edge)) {
      return true;
    }

    return is_shared_metadata_edge(edge) && edge_matches_fields(edge, nodes);
  }

  function edge_is_visible(edge) {
    if (!edge) {
      return false;
    }

    if (is_same_title_edge(edge)) {
      return true;
    }

    return effective_post_count_for_edge(edge) >= state.min_count;
  }

  function visible_edges() {
    refresh_component_edge_counts();
    return relationship_edges().filter(edge_is_visible);
  }

  function visible_edge_ids() {
    return new Set(visible_edges().map(function(edge) {
      return edge.id;
    }));
  }

  function edge_for_nodes(a_id, b_id) {
    return relationship_edges().find(function(edge) {
      return (
        (edge.source === a_id && edge.target === b_id) ||
        (edge.source === b_id && edge.target === a_id)
      );
    }) || null;
  }

  function posts_for_node(node_id) {
    return (state.data.posts || []).filter(function(post) {
      return (post.nodes || []).includes(node_id);
    });
  }

  function post_count_label(count) {
    return count === 1 ? "1 post" : count + " posts";
  }

  function shared_post_count_label(count) {
    return count === 1 ? "1 shared post" : count + " shared posts";
  }

  function unique_posts(posts) {
    const seen = new Set();
    const result = [];

    (posts || []).forEach(function(post) {
      const key = post.href || post.title || JSON.stringify(post);

      if (seen.has(key)) {
        return;
      }

      seen.add(key);
      result.push(post);
    });

    return result;
  }

  function same_title_edges() {
    return (state.data && state.data.edges || []).filter(is_same_title_edge);
  }

  function rebuild_same_title_components() {
    const nodes = by_id(state.data && state.data.nodes || []);
    const adjacency = new Map();

    same_title_edges().forEach(function(edge) {
      if (!nodes.has(edge.source) || !nodes.has(edge.target)) {
        return;
      }

      if (!adjacency.has(edge.source)) {
        adjacency.set(edge.source, []);
      }

      if (!adjacency.has(edge.target)) {
        adjacency.set(edge.target, []);
      }

      adjacency.get(edge.source).push(edge.target);
      adjacency.get(edge.target).push(edge.source);
    });

    const visited = new Set();
    const components = [];
    const by_node = new Map();

    Array.from(adjacency.keys()).sort().forEach(function(start_id) {
      if (visited.has(start_id)) {
        return;
      }

      const queue = [start_id];
      const node_ids = [];
      visited.add(start_id);

      while (queue.length) {
        const id = queue.shift();
        node_ids.push(id);

        (adjacency.get(id) || []).forEach(function(next_id) {
          if (visited.has(next_id)) {
            return;
          }

          visited.add(next_id);
          queue.push(next_id);
        });
      }

      if (node_ids.length < 2) {
        return;
      }

      node_ids.sort();

      const component_posts = unique_posts(node_ids.flatMap(function(node_id) {
        const node = nodes.get(node_id);
        return node && node.posts || posts_for_node(node_id);
      }));

      const component = {
        id: "same_title_component--" + node_ids.join("--"),
        node_ids: node_ids,
        node_id_set: new Set(node_ids),
        posts: component_posts,
        title: (nodes.get(node_ids[0]) && nodes.get(node_ids[0]).label) || "Untitled"
      };

      components.push(component);
      node_ids.forEach(function(node_id) {
        by_node.set(node_id, component);
      });
    });

    state.same_title_components = components;
    state.same_title_component_by_node = by_node;
  }

  function same_title_component_for_node(node_id) {
    return state.same_title_component_by_node && state.same_title_component_by_node.get(node_id) || null;
  }

  function same_title_component_for_edge(edge) {
    if (!edge) {
      return null;
    }

    return same_title_component_for_node(edge.source) || same_title_component_for_node(edge.target);
  }

  function component_key_for_node(node_id) {
    const component = same_title_component_for_node(node_id);
    return component ? "component:" + component.id : "node:" + node_id;
  }

  function component_edge_key_for_edge(edge) {
    return graph_edge_key(component_key_for_node(edge.source), component_key_for_node(edge.target));
  }

  function refresh_component_edge_counts() {
    const counts = new Map();

    relationship_edges().forEach(function(edge) {
      const key = component_edge_key_for_edge(edge);

      if (!counts.has(key)) {
        counts.set(key, {
          count: 0,
          posts: [],
          seen_posts: new Set()
        });
      }

      const bucket = counts.get(key);

      (edge.posts || []).forEach(function(post) {
        const post_key = post.href || post.title || JSON.stringify(post);

        if (bucket.seen_posts.has(post_key)) {
          return;
        }

        bucket.seen_posts.add(post_key);
        bucket.posts.push(post);
      });
    });

    counts.forEach(function(bucket) {
      bucket.count = bucket.posts.length;
      delete bucket.seen_posts;
    });

    state.component_edge_counts = counts;
  }

  function effective_post_count_for_edge(edge) {
    if (!edge || !is_shared_metadata_edge(edge)) {
      return edge && edge.post_count || 0;
    }

    const bucket = state.component_edge_counts && state.component_edge_counts.get(component_edge_key_for_edge(edge));
    return bucket ? bucket.count : edge.post_count;
  }

  function posts_for_node_selection(node_id) {
    const component = same_title_component_for_node(node_id);
    return component ? component.posts : posts_for_node(node_id);
  }

  function normalise_type_key(value) {
    const key = String(value || "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");

    if (key === "essay" || key === "essays") {
      return "essays";
    }

    if (key === "guide" || key === "guides") {
      return "guides";
    }

    if (key === "blog" || key === "blogs") {
      return "blog";
    }

    return "";
  }

  function node_for_id(node_id) {
    return (state.data.nodes || []).find(function(node) {
      return node.id === node_id;
    }) || null;
  }

  function css_colour(name, fallback) {
    const owner = mount || document.documentElement;
    const value = getComputedStyle(owner).getPropertyValue(name).trim() ||
        getComputedStyle(document.documentElement).getPropertyValue(name).trim();

    return value || fallback;
  }

  function parse_hex_colour(value, fallback) {
    let text = String(value || "").trim();

    if (!text || text.startsWith("var(")) {
      text = fallback || "#999999";
    }

    if (/^#[0-9a-f]{3}$/i.test(text)) {
      return {
        r: parseInt(text[1] + text[1], 16),
        g: parseInt(text[2] + text[2], 16),
        b: parseInt(text[3] + text[3], 16)
      };
    }

    if (/^#[0-9a-f]{6}$/i.test(text)) {
      return {
        r: parseInt(text.slice(1, 3), 16),
        g: parseInt(text.slice(3, 5), 16),
        b: parseInt(text.slice(5, 7), 16)
      };
    }

    return parse_hex_colour(fallback || "#999999", "#999999");
  }

  function rgb_to_hex(colour) {
    function part(value) {
      return clamp(Math.round(value), 0, 255).toString(16).padStart(2, "0");
    }

    return "#" + part(colour.r) + part(colour.g) + part(colour.b);
  }

  function mix_colour(a, b, t) {
    return {
      r: a.r + (b.r - a.r) * t,
      g: a.g + (b.g - a.g) * t,
      b: a.b + (b.b - a.b) * t
    };
  }

  function minimap_palette_anchors() {
    return [
      {
        key: "essays",
        start: parse_hex_colour(css_colour("--map-essay-start", "#dbeafe"), "#dbeafe"),
        end: parse_hex_colour(css_colour("--map-essay-end", "#dcfce7"), "#dcfce7")
      },
      {
        key: "guides",
        start: parse_hex_colour(css_colour("--map-guide-start", "#dcfce7"), "#dcfce7"),
        end: parse_hex_colour(css_colour("--map-guide-end", "#fef9c3"), "#fef9c3")
      },
      {
        key: "blog",
        start: parse_hex_colour(css_colour("--map-blog-start", "#fef3c7"), "#fef3c7"),
        end: parse_hex_colour(css_colour("--map-blog-end", "#fecaca"), "#fecaca")
      }
    ];
  }

  function colour_driver_field() {
    const x_nodes = nodes_for_field(state.x_field);
    const y_nodes = nodes_for_field(state.y_field);

    if (x_nodes.length <= y_nodes.length) {
      return state.x_field;
    }

    return state.y_field;
  }

  function generated_colour_pair(index, total) {
    const anchors = minimap_palette_anchors();
    const anchor = anchors[index % Math.max(1, anchors.length)];

    return {
      start: rgb_to_hex(anchor.start),
      end: rgb_to_hex(anchor.end)
    };
  }

  function semantic_type_colour_pair(node) {
    if (!node || node.field !== "type") {
      return null;
    }

    const key = normalise_type_key(node.value || node.label || node.id);
    const anchors = minimap_palette_anchors();
    const match = anchors.find(function(anchor) {
      return anchor.key === key;
    });

    if (!match) {
      return null;
    }

    return {
      start: rgb_to_hex(match.start),
      end: rgb_to_hex(match.end)
    };
  }

  function refresh_colour_state() {
    const field = colour_driver_field();
    const nodes = nodes_for_field(field);
    const colour_map = new Map();

    nodes.forEach(function(node, index) {
      colour_map.set(
          node.id,
          semantic_type_colour_pair(node) || generated_colour_pair(index, nodes.length)
      );
    });

    state.colour_field = field;
    state.colour_map = colour_map;
  }

  function colour_pair_for_node_id(node_id) {
    return state.colour_map && state.colour_map.get(node_id) || null;
  }

  function colour_pair_for_node(node) {
    return node ? colour_pair_for_node_id(node.id) : null;
  }

  function colour_pair_for_edge(edge) {
    if (!edge) {
      return null;
    }

    return colour_pair_for_node_id(edge.source) || colour_pair_for_node_id(edge.target) || null;
  }

  function colour_style(pair) {
    if (!pair) {
      return "";
    }

    return ' style="--graph-colour-start: ' + escape_html(pair.start) + '; --graph-colour-end: ' + escape_html(pair.end) + ';"';
  }

  function colour_class(pair) {
    return pair ? " graph_has_colour" : "";
  }

  function colour_pair_for_selection() {
    if (!state.selected) {
      return null;
    }

    if (state.selected.type === "node") {
      const direct = colour_pair_for_node_id(state.selected.id);

      if (direct) {
        return direct;
      }

      const edge = visible_edges().find(function(item) {
        return item.source === state.selected.id || item.target === state.selected.id;
      });

      return colour_pair_for_edge(edge);
    }

    if (state.selected.type === "edge") {
      return colour_pair_for_edge(selected_edge_from_data(state.selected.id));
    }

    return null;
  }

  function type_key_for_node(node) {
    if (!node || node.field !== "type") {
      return "";
    }

    return normalise_type_key(node.value || node.label || node.id);
  }

  function node_colour_field() {
    return state.colour_field || colour_driver_field();
  }

  function selection_matches(type, id) {
    return Boolean(state.selected && state.selected.type === type && state.selected.id === id);
  }

  function option_html(field, selected_key) {
    const selected = field.key === selected_key ? " selected" : "";
    return '<option value="' + escape_html(field.key) + '"' + selected + '>' + escape_html(field.label) + '</option>';
  }

  function render_controls() {
    const fields = field_options();

    return [
      '<div class="graph_controls" aria-label="Graph controls">',
      '  <div class="graph_controls_group graph_controls_compare">',
      '    <label>Compare <select id="graph_x_field">' + fields.map(function(field) { return option_html(field, state.x_field); }).join("") + '</select></label>',
      '    <label>with <select id="graph_y_field">' + fields.map(function(field) { return option_html(field, state.y_field); }).join("") + '</select></label>',
      '  </div>',
      '  <div class="graph_controls_group graph_controls_threshold">',
      '    <label>minimum shared posts <input id="graph_min_count" type="number" min="0" step="1" value="' + escape_html(state.min_count) + '"></label>',
      '  </div>',
      '</div>'
    ].join("\n");
  }

  function render_summary() {
    const edges = visible_edges();
    const post_count = new Set();

    edges.forEach(function(edge) {
      edge.posts.forEach(function(post) {
        post_count.add(post.href);
      });
    });

    return [
      '<p class="muted graph_summary" data-graph-summary>',
      'Comparing <strong>' + escape_html(field_label(state.x_field)) + '</strong> with <strong>' + escape_html(field_label(state.y_field)) + '</strong>: ',
      escape_html(edges.length) + ' relationships across ' + escape_html(post_count.size) + ' posts.',
      '</p>'
    ].join("");
  }

  function update_summary() {
    const summary = mount.querySelector("[data-graph-summary]");

    if (summary) {
      summary.outerHTML = render_summary();
    }
  }

  function matrix_orientation() {
    const x_nodes = nodes_for_field(state.x_field);
    const y_nodes = nodes_for_field(state.y_field);

    if (x_nodes.length <= y_nodes.length) {
      return {
        column_field: state.x_field,
        row_field: state.y_field,
        column_nodes: x_nodes,
        row_nodes: y_nodes
      };
    }

    return {
      column_field: state.y_field,
      row_field: state.x_field,
      column_nodes: y_nodes,
      row_nodes: x_nodes
    };
  }

  function node_full_label(node) {
    return node && (node.identity_label || node.full_label || node.label || node.id) || "";
  }

  function render_matrix_header(node, axis) {
    const axis_attribute = axis === "column" ? "data-column-node-id" : "data-row-node-id";
    const pair = colour_pair_for_node(node);
    const full_label = node_full_label(node);
    const select_label = "Select " + full_label + " in the graph";

    return [
      '<th ' + axis_attribute + '="' + escape_html(node.id) + '" data-node-id="' + escape_html(node.id) + '" class="graph_matrix_header' + colour_class(pair) + '"' + colour_style(pair) + ' tabindex="0" role="button" aria-label="' + escape_html(select_label) + '">',
      '  <a class="graph_matrix_header_link" href="' + escape_html(node.href) + '" title="' + escape_html(full_label) + '"><span class="graph_matrix_header_text">' + escape_html(node.label) + '</span></a>',
      '</th>'
    ].join("");
  }

  function render_matrix_cell(row_node, column_node) {
    const edge = edge_for_nodes(row_node.id, column_node.id);

    if (!edge) {
      const empty_text = state.min_count === 0 ? "0" : "";
      const empty_class = state.min_count === 0 ? "graph_matrix_empty graph_matrix_zero" : "graph_matrix_empty";
      return '<td class="' + empty_class + '" data-row-node-id="' + escape_html(row_node.id) + '" data-column-node-id="' + escape_html(column_node.id) + '">' + empty_text + '</td>';
    }

    const pair = colour_pair_for_edge(edge);

    return [
      '<td data-row-node-id="' + escape_html(row_node.id) + '" data-column-node-id="' + escape_html(column_node.id) + '">',
      '  <button type="button" class="graph_matrix_cell' + colour_class(pair) + '"' + colour_style(pair) + ' data-edge-id="' + escape_html(edge.id) + '" data-source-id="' + escape_html(edge.source) + '" data-target-id="' + escape_html(edge.target) + '">',
      '    <span>' + escape_html(edge.post_count) + '</span>',
      '  </button>',
      '</td>'
    ].join("");
  }

  function render_matrix() {
    const orientation = matrix_orientation();

    if (!orientation.row_nodes.length || !orientation.column_nodes.length) {
      return '<p class="muted">There is not enough metadata to build this matrix.</p>';
    }

    return [
      '<section class="graph_matrix_panel" aria-label="Relationship matrix selector">',
      '  <div class="graph_matrix_panel_header">',
      '    <h2>Relationship matrix</h2>',
      '    <p class="muted">Rows use the larger field and columns use the smaller field to reduce horizontal scrolling.</p>',
      '  </div>',
      '  <div class="graph_matrix_wrap">',
      '    <table class="graph_matrix">',
      '      <thead>',
      '        <tr>',
      '          <th>' + escape_html(field_label(orientation.row_field)) + ' ⇔ ' + escape_html(field_label(orientation.column_field)) + '</th>',
      orientation.column_nodes.map(function(node) {
        return '          ' + render_matrix_header(node, "column");
      }).join("\n"),
      '        </tr>',
      '      </thead>',
      '      <tbody>',
      orientation.row_nodes.map(function(row_node) {
        return [
          '        <tr data-row-node-id="' + escape_html(row_node.id) + '">',
          '          ' + render_matrix_header(row_node, "row"),
          orientation.column_nodes.map(function(column_node) {
            return render_matrix_cell(row_node, column_node);
          }).join("\n"),
          '        </tr>'
        ].join("\n");
      }).join("\n"),
      '      </tbody>',
      '    </table>',
      '  </div>',
      '</section>'
    ].join("\n");
  }

  function render_force_graph() {
    const x_nodes = nodes_for_field(state.x_field);
    const y_nodes = nodes_for_field(state.y_field);

    if (!x_nodes.length || !y_nodes.length) {
      return '<p class="muted">There is not enough metadata to build this graph.</p>';
    }

    return [
      '<section class="graph_force" aria-label="Interactive metadata graph">',
      '  <div class="graph_toolbar" aria-label="Graph viewport controls">',
      '    <button type="button" data-graph-zoom-out aria-label="Zoom out">−</button>',
      '    <span class="graph_zoom_label" data-graph-zoom-label>100%</span>',
      '    <button type="button" data-graph-zoom-in aria-label="Zoom in">+</button>',
      '    <button type="button" data-graph-fit>Fit</button>',
      '    <button type="button" data-graph-reset>Reset</button>',
      '  </div>',
      '  <div class="graph_viewport" data-graph-viewport>',
      '    <svg class="graph_canvas" data-graph-svg role="img" aria-label="Metadata relationship graph">',
      '      <g class="graph_scene" data-graph-scene>',
      '        <g class="graph_edges" data-graph-edges></g>',
      '        <g class="graph_nodes" data-graph-nodes></g>',
      '      </g>',
      '    </svg>',
      '  </div>',
      '  <p class="muted graph_hint">Mouse wheel zooms. Drag the background to pan. Drag nodes to rearrange them. Select nodes, edges, matrix headers, or matrix cells for details. Click empty graph space to clear selection.</p>',
      '</section>'
    ].join("\n");
  }

  function render_posts(posts) {
    if (!posts || !posts.length) {
      return '<p class="muted">No linked posts.</p>';
    }

    return [
      '<ul class="graph_post_list">',
      posts.map(function(post) {
        const meta = [post.date, post.type_label].filter(Boolean).join(" · ");

        return [
          '<li>',
          '  <a class="graph_detail_card" href="' + escape_html(post.href) + '">',
          '    <span class="graph_detail_card_title">' + escape_html(post.title) + '</span>',
          meta ? '    <span class="graph_detail_card_meta">' + escape_html(meta) + '</span>' : '',
          '  </a>',
          '</li>'
        ].filter(Boolean).join("");
      }).join(""),
      '</ul>'
    ].join("\n");
  }

  function render_detail_content() {
    if (!state.selected) {
      return [
        '<h2>Selection</h2>',
        '<p class="muted">Select a matrix header, matrix cell, graph node, or graph edge to inspect the connected posts.</p>'
      ].join("\n");
    }

    const filtered_note = state.selected.type === "node" && state.graph
        ? (function() {
          const node = state.graph.node_map.get(state.selected.id);

          if (node && (node.visible_degree || 0) === 0) {
            return '<p class="muted">No visible relationships at the current minimum shared-post threshold.</p>';
          }

          return '';
        }())
        : '';

    return [
      '<h2>' + escape_html(state.selected.title) + '</h2>',
      '<p class="muted">' + escape_html(state.selected.summary) + '</p>',
      filtered_note,
      state.selected.href ? '<p><a class="graph_detail_link" href="' + escape_html(state.selected.href) + '">' + escape_html(state.selected.href_label || "Open metadata page") + '</a></p>' : '',
      render_posts(state.selected.posts)
    ].filter(function(line) {
      return line !== "";
    }).join("\n");
  }

  function render_detail() {
    return [
      '<aside class="graph_detail_shell" aria-label="Selected graph details">',
      '  <div class="graph_detail" data-graph-detail>' + render_detail_content() + '</div>',
      '</aside>'
    ].join("\n");
  }

  function destroy_graph() {
    stop_graph_animation();

    if (state.graph && state.graph.resize_observer) {
      state.graph.resize_observer.disconnect();
    }

    state.graph = null;
  }

  function render() {
    destroy_graph();

    if (!selected_fields_valid()) {
      mount.innerHTML = [
        render_controls(),
        '<p class="muted">Choose two different metadata fields to compare.</p>'
      ].join("\n");
      bind_events();
      return;
    }

    refresh_colour_state();
    refresh_component_edge_counts();

    mount.innerHTML = [
      render_controls(),
      render_summary(),
      render_matrix(),
      '<div class="graph_workspace graph_hybrid_workspace">',
      '  <section class="graph_view">',
      render_force_graph(),
      '  </section>',
      render_detail(),
      '</div>'
    ].join("\n");

    bind_events();
    initialise_force_graph();
    update_all_selection_surfaces();
  }

  function update_detail_panel() {
    const detail = mount.querySelector("[data-graph-detail]");

    if (detail) {
      const pair = colour_pair_for_selection();

      detail.classList.toggle("graph_has_colour", Boolean(pair));

      if (pair) {
        detail.style.setProperty("--graph-colour-start", pair.start);
        detail.style.setProperty("--graph-colour-end", pair.end);
      } else {
        detail.style.removeProperty("--graph-colour-start");
        detail.style.removeProperty("--graph-colour-end");
      }

      detail.innerHTML = render_detail_content();
    }
  }

  function update_all_selection_surfaces() {
    refresh_graph_derived_state();
    update_graph_filter_classes();
    update_matrix_filter_classes();
    update_detail_panel();
    update_graph_selection_classes();
    update_matrix_selection_classes();
    update_hover_surfaces();
  }

  function selected_edge_from_data(edge_id) {
    if (state.graph) {
      const graph_edge = graph_active_edges(state.graph).find(function(item) {
        return item.id === edge_id;
      });

      if (graph_edge) {
        return graph_edge;
      }
    }

    const visible = visible_edge_ids();
    if (!visible.has(edge_id)) {
      return null;
    }

    return state.data.edges.find(function(item) {
      return item.id === edge_id;
    }) || null;
  }

  function set_selected_edge(edge_id) {
    const edge = selected_edge_from_data(edge_id);

    if (!edge) {
      clear_selection();
      return;
    }

    const nodes = by_id(state.data.nodes);
    const source = nodes.get(edge.source);
    const target = nodes.get(edge.target);

    const same_title = is_same_title_edge(edge);
    const component = same_title ? same_title_component_for_edge(edge) : null;
    const edge_posts = component ? component.posts : edge.posts;

    state.selected = {
      type: "edge",
      id: edge.id,
      source_id: edge.source,
      target_id: edge.target,
      title: same_title
          ? "Same title: " + (component && component.title || edge.title || source && source.label || target && target.label || "Untitled")
          : (source ? source.label : edge.source) + " ⇔ " + (target ? target.label : edge.target),
      summary: same_title
          ? post_count_label(edge_posts.length) + " in this same-title group."
          : shared_post_count_label(edge.post_count),
      posts: edge_posts
    };

    update_all_selection_surfaces();
  }

  function set_selected_node(node_id) {
    const node = state.data.nodes.find(function(item) {
      return item.id === node_id;
    });

    if (!node) {
      clear_selection();
      return;
    }

    const component = same_title_component_for_node(node.id);
    const selection_posts = posts_for_node_selection(node.id);

    const declared_empty_type = node.field === "type" && (node.post_count || 0) === 0;

    state.selected = {
      type: "node",
      id: node.id,
      title: node.field_label + ": " + node.label,
      summary: component
          ? "Same-title group across " + post_count_label(selection_posts.length) + "."
          : declared_empty_type
              ? "Declared site section with no visible posts."
              : (node.identity_label && node.identity_label !== node.label ? node.identity_label + " · " : "") + "Used by " + post_count_label(node.post_count),
      href: node.href,
      href_label: "Open metadata page",
      posts: selection_posts
    };

    update_all_selection_surfaces();
  }

  function clear_selection() {
    if (!state.selected) {
      return;
    }

    state.selected = null;
    update_all_selection_surfaces();
  }

  function toggle_selected_edge(edge_id) {
    if (selection_matches("edge", edge_id)) {
      clear_selection();
      return;
    }

    set_selected_edge(edge_id);
  }

  function toggle_selected_node(node_id) {
    if (selection_matches("node", node_id)) {
      clear_selection();
      return;
    }

    set_selected_node(node_id);
  }

  function bind_events() {
    const x_select = document.getElementById("graph_x_field");
    const y_select = document.getElementById("graph_y_field");
    const min_input = document.getElementById("graph_min_count");

    if (x_select) {
      x_select.addEventListener("change", function() {
        state.x_field = x_select.value;
        state.selected = null;
        state.hovered = null;
        render();
      });
    }

    if (y_select) {
      y_select.addEventListener("change", function() {
        state.y_field = y_select.value;
        state.selected = null;
        state.hovered = null;
        render();
      });
    }

    if (min_input) {
      ["input", "change"].forEach(function(event_name) {
        min_input.addEventListener(event_name, function() {
          handle_min_count_change(min_input.value);
        });
      });
    }

    const matrix_panel = mount.querySelector(".graph_matrix_panel");

    if (matrix_panel) {
      matrix_panel.addEventListener("click", function(event) {
        if (event.target.closest("a")) {
          return;
        }

        const edge_target = event.target.closest(".graph_matrix_cell[data-edge-id]");

        if (edge_target) {
          event.preventDefault();

          if (edge_target.classList.contains("is_filtered")) {
            clear_selection();
            return;
          }

          toggle_selected_edge(edge_target.getAttribute("data-edge-id"));
          return;
        }

        const header_target = event.target.closest(".graph_matrix_header[data-node-id]");

        if (header_target) {
          event.preventDefault();
          toggle_selected_node(header_target.getAttribute("data-node-id"));
          return;
        }

        clear_selection();
      });

      matrix_panel.addEventListener("mouseover", function(event) {
        const cell_target = event.target.closest(".graph_matrix_cell[data-edge-id]");

        if (cell_target && matrix_panel.contains(cell_target)) {
          set_hovered_edge(cell_target.getAttribute("data-edge-id"));
          return;
        }

        const header_target = event.target.closest(".graph_matrix_header[data-node-id]");

        if (header_target && matrix_panel.contains(header_target)) {
          set_hovered_node(header_target.getAttribute("data-node-id"));
        }
      });

      matrix_panel.addEventListener("mouseout", function(event) {
        const target = event.target.closest(".graph_matrix_cell[data-edge-id], .graph_matrix_header[data-node-id]");

        if (!target || !matrix_panel.contains(target)) {
          return;
        }

        if (event.relatedTarget && target.contains(event.relatedTarget)) {
          return;
        }

        clear_hovered();
      });

      matrix_panel.addEventListener("keydown", function(event) {
        if (event.target.closest("a")) {
          return;
        }

        if (event.key !== "Enter" && event.key !== " ") {
          return;
        }

        const header_target = event.target.closest(".graph_matrix_header[data-node-id]");

        if (!header_target || event.target !== header_target) {
          return;
        }

        event.preventDefault();
        toggle_selected_node(header_target.getAttribute("data-node-id"));
      });
    }
  }

  function graph_node_metrics(node) {
    const degree = Math.max(0, node.visible_degree || 0);
    const weighted_degree = Math.max(0, node.visible_weight || 0);
    const declared_empty_type = node.field === "type" && (node.post_count || 0) === 0;
    const isolated = degree === 0;
    const leaf = degree === 1;
    const hub = degree >= 4 || weighted_degree >= 8;
    const degree_radius = Math.sqrt(degree) * graph_settings.node_degree_radius_scale;
    const radius = clamp(
        graph_settings.node_radius + degree_radius + (declared_empty_type ? -0.35 : 0),
        graph_settings.node_min_radius,
        graph_settings.node_max_radius
    );

    return {
      degree: degree,
      weighted_degree: weighted_degree,
      declared_empty_type: declared_empty_type,
      isolated: isolated,
      leaf: leaf,
      hub: hub,
      radius: radius,
      label_bonus: estimated_label_bonus(node)
    };
  }

  function update_node_metrics(graph) {
    if (!graph) {
      return;
    }

    graph.nodes.forEach(function(node) {
      const metrics = graph_node_metrics(node);
      node.metrics = metrics;
      node.radius = metrics.radius;
      node.circle_collision_radius = metrics.radius + graph_settings.collision_padding;
      node.collision_radius = node.circle_collision_radius + metrics.label_bonus;
    });
  }

  function truncate_label(value) {
    const text = String(value || "");

    if (text.length <= 34) {
      return text;
    }

    return text.slice(0, 31) + "…";
  }

  function estimated_label_bonus(node) {
    return Math.min(
        graph_settings.label_collision_max_bonus,
        truncate_label(node.label).length * graph_settings.label_collision_strength
    );
  }

  function stable_node_seed(value) {
    const text = String(value || "");
    let hash = 2166136261;

    for (let i = 0; i < text.length; i = i + 1) {
      hash = hash ^ text.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }

    return hash >>> 0;
  }

  function seeded_unit(seed, salt) {
    let value = seed ^ Math.imul(salt || 1, 2654435761);
    value = Math.imul(value ^ (value >>> 15), 2246822519);
    value = Math.imul(value ^ (value >>> 13), 3266489917);
    return ((value ^ (value >>> 16)) >>> 0) / 4294967295;
  }

  function initial_node_position(node, index, total, width, height) {
    const seed = stable_node_seed(node.id || node.field + ":" + node.label);
    const golden_angle = Math.PI * (3 - Math.sqrt(5));
    const angle = total <= 1
        ? seeded_unit(seed, 3) * Math.PI * 2
        : index * golden_angle + seeded_unit(seed, 5) * 0.42;
    const available = Math.max(24, Math.min(width, height) * 0.2);
    const max_radius = Math.min(graph_settings.spawn_radius_max, available);
    const min_radius = Math.min(graph_settings.spawn_radius_min, max_radius);
    const progress = total <= 1 ? 0 : Math.sqrt((index + 0.5) / total);
    const radius = min_radius + (max_radius - min_radius) * progress;
    const jitter = graph_settings.spawn_jitter;
    const jitter_x = (seeded_unit(seed, 11) - 0.5) * jitter;
    const jitter_y = (seeded_unit(seed, 17) - 0.5) * jitter;

    return {
      x: width / 2 + Math.cos(angle) * radius + jitter_x,
      y: height / 2 + Math.sin(angle) * radius + jitter_y
    };
  }

  function visible_force_nodes_and_edges(width, height) {
    const raw_nodes = nodes_for_field(state.x_field).concat(nodes_for_field(state.y_field));
    const visible_node_ids = new Set(raw_nodes.map(function(node) {
      return node.id;
    }));

    const graph_nodes = raw_nodes.map(function(node, index) {
      const position = initial_node_position(node, index, raw_nodes.length, width, height);
      const radius = graph_settings.node_radius;

      return Object.assign({}, node, {
        x: position.x,
        y: position.y,
        vx: 0,
        vy: 0,
        radius: radius,
        collision_radius: radius + graph_settings.collision_padding + estimated_label_bonus(node)
      });
    });

    const node_map = by_id(graph_nodes);
    const all_nodes = by_id(state.data.nodes);
    const graph_edges = state.data.edges
        .filter(function(edge) {
          return force_edge_matches_current_nodes(edge, visible_node_ids, all_nodes);
        })
        .map(function(edge) {
          return Object.assign({}, edge, {
            source_node: node_map.get(edge.source),
            target_node: node_map.get(edge.target)
          });
        })
        .filter(function(edge) {
          return edge.source_node && edge.target_node;
        });

    return {
      nodes: graph_nodes,
      edges: graph_edges,
      node_map: node_map
    };
  }

  function graph_active_nodes(graph) {
    if (!graph) {
      return [];
    }

    return graph.nodes.filter(function(node) {
      return node.is_visible !== false;
    });
  }

  function graph_active_edges(graph) {
    if (!graph) {
      return [];
    }

    return graph.edges.filter(function(edge) {
      return edge.is_visible !== false && edge.source_node.is_visible !== false && edge.target_node.is_visible !== false;
    });
  }

  function refresh_graph_derived_state() {
    const graph = state.graph;

    if (!graph) {
      return;
    }

    refresh_component_edge_counts();

    graph.edges.forEach(function(edge) {
      edge.is_visible = edge_is_visible(edge);
    });

    graph.nodes.forEach(function(node) {
      node.visible_degree = 0;
      node.visible_weight = 0;
      node.is_visible = false;
    });

    graph.edges.forEach(function(edge) {
      if (!edge.is_visible) {
        return;
      }

      const weight = Math.max(1, effective_post_count_for_edge(edge));
      edge.source_node.visible_degree = (edge.source_node.visible_degree || 0) + 1;
      edge.target_node.visible_degree = (edge.target_node.visible_degree || 0) + 1;
      edge.source_node.visible_weight = (edge.source_node.visible_weight || 0) + weight;
      edge.target_node.visible_weight = (edge.target_node.visible_weight || 0) + weight;
    });

    graph.nodes.forEach(function(node) {
      const selected = Boolean(state.selected && state.selected.type === "node" && state.selected.id === node.id);
      const declared_empty_type = node.field === "type" && (node.post_count || 0) === 0;
      const show_declared_empty = state.min_count === 0 && declared_empty_type;
      node.is_visible = !graph_settings.hide_isolated_nodes || node.visible_degree > 0 || selected || show_declared_empty;
    });

    graph.linked_pairs = new Set();
    graph_active_edges(graph).forEach(function(edge) {
      graph.linked_pairs.add(graph_link_key(edge.source, edge.target));
    });

    update_node_metrics(graph);
  }

  function update_graph_filter_classes() {
    const graph = state.graph;

    if (!graph) {
      return;
    }

    graph.nodes_layer.querySelectorAll(".graph_force_node").forEach(function(node_element) {
      const node = graph.node_map.get(node_element.getAttribute("data-node-id"));
      node_element.classList.toggle("is_filtered", Boolean(node && node.is_visible === false));
    });

    graph.edges_layer.querySelectorAll("[data-edge-id]").forEach(function(edge_element) {
      const edge = graph.edges.find(function(item) {
        return item.id === edge_element.getAttribute("data-edge-id");
      });
      const hidden = !edge || edge.is_visible === false || edge.source_node.is_visible === false || edge.target_node.is_visible === false;
      edge_element.classList.toggle("is_filtered", hidden);
    });
  }

  function graph_link_key(a_id, b_id) {
    return [String(a_id || ""), String(b_id || "")].sort().join("--");
  }


  function graph_kick_active(graph) {
    return Boolean(graph && graph.kick_until && performance.now() < graph.kick_until);
  }

  function graph_charge_kick_multiplier(graph) {
    return graph_kick_active(graph) ? graph_settings.reset_kick_charge_multiplier : 1;
  }

  function graph_link_kick_multiplier(graph) {
    return graph_kick_active(graph) ? graph_settings.reset_kick_link_multiplier : 1;
  }

  function start_reset_kick(fit_after_kick) {
    const graph = state.graph;

    if (!graph) {
      return;
    }

    graph.fit_after_kick = fit_after_kick === true;

    if (prefers_reduced_motion()) {
      graph.kick_until = 0;

      if (graph.fit_after_kick) {
        graph.fit_after_kick = false;
        requestAnimationFrame(fit_graph);
      }

      return;
    }

    graph.kick_until = performance.now() + graph_settings.reset_kick_duration_ms;
  }

  function fit_graph_after_kick_if_ready(graph) {
    if (!graph || !graph.fit_after_kick || graph_kick_active(graph)) {
      return;
    }

    graph.fit_after_kick = false;
    fit_graph();
  }

  function update_matrix_filter_classes() {
    const visible = visible_edge_ids();

    mount.querySelectorAll(".graph_matrix_cell[data-edge-id]").forEach(function(cell) {
      cell.classList.toggle("is_filtered", !visible.has(cell.getAttribute("data-edge-id")));
    });
  }

  function validate_selection_after_filter() {
    if (!state.selected) {
      return;
    }

    if (state.selected.type === "edge" && !selected_edge_from_data(state.selected.id)) {
      state.selected = null;
    }
  }

  function update_filtered_visibility() {
    refresh_graph_derived_state();
    validate_selection_after_filter();
    refresh_graph_derived_state();
    update_summary();
    update_matrix_filter_classes();
    update_graph_filter_classes();
    update_all_selection_surfaces();
  }

  function handle_min_count_change(value) {
    const parsed = Number(value);
    const next = Number.isFinite(parsed) ? Math.max(0, parsed) : 0;

    if (next === state.min_count) {
      return;
    }

    state.min_count = next;
    update_filtered_visibility();
    reheat_graph(graph_settings.filter_reheat);
    start_graph_animation();
  }

  function create_svg_element(name, attributes) {
    const element = document.createElementNS(svg_ns, name);

    Object.keys(attributes || {}).forEach(function(key) {
      element.setAttribute(key, attributes[key]);
    });

    return element;
  }

  function initialise_force_graph() {
    const svg = mount.querySelector("[data-graph-svg]");
    const scene = mount.querySelector("[data-graph-scene]");
    const edges_layer = mount.querySelector("[data-graph-edges]");
    const nodes_layer = mount.querySelector("[data-graph-nodes]");
    const viewport = mount.querySelector("[data-graph-viewport]");

    if (!svg || !scene || !edges_layer || !nodes_layer || !viewport) {
      return;
    }

    const rect = viewport.getBoundingClientRect();
    const width = Math.max(320, rect.width || 720);
    const height = Math.max(280, rect.height || 420);
    const prepared = visible_force_nodes_and_edges(width, height);

    svg.setAttribute("viewBox", "0 0 " + width + " " + height);

    state.graph = {
      svg: svg,
      scene: scene,
      edges_layer: edges_layer,
      nodes_layer: nodes_layer,
      viewport: viewport,
      width: width,
      height: height,
      nodes: prepared.nodes,
      edges: prepared.edges,
      node_map: prepared.node_map,
      zoom: 1,
      pan_x: 0,
      pan_y: 0,
      alpha: 0,
      animation_frame: 0,
      dragging_node: null,
      pointer: null,
      linked_pairs: new Set(),
      kick_until: 0,
      fit_after_kick: false
    };

    refresh_graph_derived_state();
    draw_force_graph();
    bind_force_graph_events();
    update_filtered_visibility();
    initialise_graph_resize_observer();
    start_reset_kick(true);
    reheat_graph(graph_settings.view_reheat);
    start_graph_animation();
  }

  function initialise_graph_resize_observer() {
    const graph = state.graph;

    if (!graph || typeof ResizeObserver === "undefined") {
      return;
    }

    let resize_frame = 0;

    graph.resize_observer = new ResizeObserver(function() {
      if (resize_frame) {
        return;
      }

      resize_frame = requestAnimationFrame(function() {
        resize_frame = 0;

        if (!state.graph || state.graph !== graph || !graph.viewport.isConnected) {
          return;
        }

        const rect = graph.viewport.getBoundingClientRect();
        const next_width = Math.max(320, rect.width || graph.width);
        const next_height = Math.max(280, rect.height || graph.height);

        if (Math.abs(next_width - graph.width) < 2 && Math.abs(next_height - graph.height) < 2) {
          return;
        }

        const x_ratio = next_width / Math.max(1, graph.width);
        const y_ratio = next_height / Math.max(1, graph.height);

        graph.nodes.forEach(function(node) {
          node.x = node.x * x_ratio;
          node.y = node.y * y_ratio;
        });

        graph.pan_x = graph.pan_x * x_ratio;
        graph.pan_y = graph.pan_y * y_ratio;
        graph.width = next_width;
        graph.height = next_height;
        graph.svg.setAttribute("viewBox", "0 0 " + graph.width + " " + graph.height);
        render_graph_scene();
        reheat_graph(graph_settings.resize_reheat);
        start_graph_animation();
      });
    });

    graph.resize_observer.observe(graph.viewport);
  }

  function edge_stroke_width(edge, state_name) {
    if (state_name === "selected") {
      return graph_settings.edge_selected_stroke_width;
    }

    if (state_name === "connected") {
      return graph_settings.edge_connected_stroke_width;
    }

    return graph_settings.edge_stroke_width;
  }

  function draw_force_graph() {
    const graph = state.graph;

    if (!graph) {
      return;
    }

    graph.edges_layer.textContent = "";
    graph.nodes_layer.textContent = "";

    graph.edges.forEach(function(edge) {
      const pair = colour_pair_for_edge(edge);
      const same_title = is_same_title_edge(edge);
      const edge_type_class = same_title ? " graph_edge_same_title" : "";
      const hit_line = create_svg_element("line", {
        class: "graph_force_edge_hit" + edge_type_class + colour_class(pair),
        "data-edge-id": edge.id,
        "stroke-width": String(graph_settings.edge_hit_stroke_width)
      });
      const line = create_svg_element("line", {
        class: "graph_force_edge" + edge_type_class + colour_class(pair),
        "data-edge-id": edge.id,
        "stroke-width": String(edge_stroke_width(edge, "normal"))
      });
      const label = create_svg_element("text", {
        class: "graph_force_edge_label" + edge_type_class + colour_class(pair),
        "data-edge-id": edge.id,
        "text-anchor": "middle",
        "font-size": String(graph_settings.edge_label_font_size)
      });
      const title = create_svg_element("title");

      if (pair) {
        [hit_line, line, label].forEach(function(element) {
          element.style.setProperty("--graph-colour-start", pair.start);
          element.style.setProperty("--graph-colour-end", pair.end);
        });
      }

      label.textContent = same_title ? "≡" : String(edge.post_count);
      title.textContent = same_title
          ? "Same title: " + (edge.title || "Untitled")
          : edge.post_count + (edge.post_count === 1 ? " shared post" : " shared posts");
      hit_line.appendChild(title);
      graph.edges_layer.appendChild(hit_line);
      graph.edges_layer.appendChild(line);
      graph.edges_layer.appendChild(label);
    });

    graph.nodes.forEach(function(node) {
      const pair = colour_pair_for_node(node);
      const driver_class = node.field === node_colour_field()
          ? " graph_force_node_colour_driver"
          : " graph_force_node_alternate";
      const group = create_svg_element("g", {
        class: "graph_force_node graph_force_node_" + (node.field === state.x_field ? "x" : "y") + driver_class + colour_class(pair),
        "data-node-id": node.id,
        tabindex: "0",
        role: "button",
        "aria-label": node.field_label + ": " + node_full_label(node)
      });

      if (pair) {
        group.style.setProperty("--graph-colour-start", pair.start);
        group.style.setProperty("--graph-colour-end", pair.end);
      }
      const circle = create_svg_element("circle", {
        class: "graph_force_node_circle",
        r: String(node.radius)
      });
      const label = create_svg_element("text", {
        class: "graph_force_node_label",
        x: String(node.radius + graph_settings.node_label_gap),
        y: "4",
        "text-anchor": "start"
      });
      const count = create_svg_element("text", {
        class: "graph_force_node_count",
        x: String(node.radius + graph_settings.node_label_gap),
        y: "18",
        "text-anchor": "start",
        "font-weight": String(graph_settings.node_count_font_weight)
      });
      const title = create_svg_element("title");

      label.textContent = truncate_label(node.label);
      count.textContent = String(node.post_count || 0) + " posts";
      title.textContent = node.field_label + ": " + node_full_label(node) + " · " + post_count_label(node.post_count);

      group.appendChild(title);
      group.appendChild(circle);
      group.appendChild(label);
      group.appendChild(count);
      graph.nodes_layer.appendChild(group);
    });

    render_graph_scene();
    update_graph_selection_classes();
    update_graph_hover_classes();
  }

  function zoom_fade(zoom, start, range) {
    return clamp((zoom - start) / Math.max(0.001, range), 0, 1);
  }

  function update_graph_zoom_dependent_styles() {
    const graph = state.graph;

    if (!graph) {
      return;
    }

    const label_opacity = zoom_fade(
        graph.zoom,
        graph_settings.node_label_visible_zoom,
        graph_settings.node_label_fade_range
    );
    const count_opacity = zoom_fade(
        graph.zoom,
        graph_settings.node_count_visible_zoom,
        graph_settings.node_count_fade_range
    );

    graph.nodes_layer.querySelectorAll(".graph_force_node_label").forEach(function(label) {
      label.style.opacity = String(label_opacity);
    });

    graph.nodes_layer.querySelectorAll(".graph_force_node_count").forEach(function(count) {
      count.style.opacity = String(count_opacity);
    });

    const edge_label_opacity = zoom_fade(
        graph.zoom,
        graph_settings.edge_label_visible_zoom,
        graph_settings.edge_label_fade_range
    );

    graph.svg.classList.toggle(
        "graph_edges_interactive",
        graph.zoom >= graph_settings.edge_interaction_min_zoom
    );

    graph.edges_layer.querySelectorAll(".graph_force_edge_label").forEach(function(label) {
      const show = (label.classList.contains("is_selected") ||
          label.classList.contains("is_connected") ||
          label.classList.contains("is_hovered") ||
          label.classList.contains("is_hover_connected")) &&
          !label.classList.contains("is_filtered");
      label.style.opacity = String(show ? edge_label_opacity : 0);
    });
  }

  function render_graph_scene() {
    const graph = state.graph;

    if (!graph) {
      return;
    }

    graph.scene.setAttribute("transform", "translate(" + graph.pan_x + " " + graph.pan_y + ") scale(" + graph.zoom + ")");

    graph.edges_layer.querySelectorAll(".graph_force_edge, .graph_force_edge_hit").forEach(function(line) {
      const edge = graph.edges.find(function(item) {
        return item.id === line.getAttribute("data-edge-id");
      });

      if (!edge) {
        return;
      }

      line.setAttribute("x1", edge.source_node.x);
      line.setAttribute("y1", edge.source_node.y);
      line.setAttribute("x2", edge.target_node.x);
      line.setAttribute("y2", edge.target_node.y);
    });

    graph.edges_layer.querySelectorAll(".graph_force_edge_label").forEach(function(label) {
      const edge = graph.edges.find(function(item) {
        return item.id === label.getAttribute("data-edge-id");
      });

      if (!edge) {
        return;
      }

      label.setAttribute("x", (edge.source_node.x + edge.target_node.x) / 2);
      label.setAttribute("y", (edge.source_node.y + edge.target_node.y) / 2 - 4);
    });

    graph.edges_layer.querySelectorAll(".graph_force_edge_hit, .graph_force_edge").forEach(function(edge_element) {
      edge_element.addEventListener("pointerenter", function() {
        set_hovered_edge(edge_element.getAttribute("data-edge-id"));
      });

      edge_element.addEventListener("pointerleave", clear_hovered);
    });

    graph.nodes_layer.querySelectorAll(".graph_force_node").forEach(function(group) {
      const node = graph.node_map.get(group.getAttribute("data-node-id"));

      if (!node) {
        return;
      }

      const circle = group.querySelector(".graph_force_node_circle");
      const label = group.querySelector(".graph_force_node_label");
      const count = group.querySelector(".graph_force_node_count");
      const text_x = String(node.radius + graph_settings.node_label_gap);

      if (circle) {
        circle.setAttribute("r", String(node.radius));
      }

      if (label) {
        label.setAttribute("x", text_x);
      }

      if (count) {
        count.setAttribute("x", text_x);
      }

      group.setAttribute("transform", "translate(" + node.x + " " + node.y + ")");
    });

    update_zoom_label();
    update_graph_zoom_dependent_styles();
  }

  function update_zoom_label() {
    const graph = state.graph;
    const label = mount.querySelector("[data-graph-zoom-label]");

    if (graph && label) {
      label.textContent = Math.round(graph.zoom * 100) + "%";
    }
  }

  function edge_post_weight(edge) {
    if (!edge || is_same_title_edge(edge)) {
      return 1;
    }

    return Math.max(1, effective_post_count_for_edge(edge));
  }

  function link_distance_for_edge(edge) {
    if (is_same_title_edge(edge)) {
      return graph_settings.same_title_link_distance;
    }

    const source_metrics = edge.source_node.metrics || graph_node_metrics(edge.source_node);
    const target_metrics = edge.target_node.metrics || graph_node_metrics(edge.target_node);
    const both_leaf_like = source_metrics.degree <= 1 && target_metrics.degree <= 1;
    const touches_leaf = source_metrics.leaf || target_metrics.leaf;
    const touches_empty_type = source_metrics.declared_empty_type || target_metrics.declared_empty_type;
    let base = graph_settings.link_distance;

    if (both_leaf_like) {
      base = graph_settings.leaf_pair_link_distance;
    } else if (touches_leaf) {
      base = graph_settings.leaf_link_distance;
    }

    if (touches_empty_type) {
      base = base * 0.92;
    }

    return Math.max(
        graph_settings.link_min_distance,
        base - edge_post_weight(edge) * graph_settings.link_count_distance_reduction
    );
  }

  function link_strength_for_edge(edge) {
    if (is_same_title_edge(edge)) {
      return graph_settings.same_title_link_strength;
    }

    const source_metrics = edge.source_node.metrics || graph_node_metrics(edge.source_node);
    const target_metrics = edge.target_node.metrics || graph_node_metrics(edge.target_node);
    const touches_leaf = source_metrics.leaf || target_metrics.leaf;
    const base = touches_leaf
        ? graph_settings.leaf_link_strength
        : graph_settings.link_strength;

    return base + Math.min(
        graph_settings.link_max_strength_bonus,
        edge_post_weight(edge) * graph_settings.link_count_strength
    );
  }

  function charge_strength_for_pair(a, b, graph) {
    const linked = graph.linked_pairs && graph.linked_pairs.has(graph_link_key(a.id, b.id));
    const a_metrics = a.metrics || graph_node_metrics(a);
    const b_metrics = b.metrics || graph_node_metrics(b);
    const base_radius = Math.max(0.001, graph_settings.node_radius);
    const largest_radius = Math.max(a.radius || base_radius, b.radius || base_radius);
    const radius_factor = Math.max(0.75, largest_radius / base_radius);
    const radius_scale = 1 + (Math.sqrt(radius_factor) - 1) * graph_settings.radius_charge_scale;
    let base = linked
        ? graph_settings.linked_charge_strength
        : graph_settings.unlinked_charge_strength;

    if (a_metrics.leaf || b_metrics.leaf) {
      base = Math.min(base, graph_settings.leaf_charge_strength);
    }

    if (a_metrics.isolated || b_metrics.isolated) {
      base *= 0.78;
    }

    if (a_metrics.declared_empty_type || b_metrics.declared_empty_type) {
      base *= 0.68;
    }

    if (a_metrics.hub || b_metrics.hub) {
      base *= 1.18;
    }

    return base * radius_scale;
  }

  function apply_colour_cluster_force(graph) {
    if (!graph_settings.colour_cluster_strength || !state.colour_field) {
      return;
    }

    const strength = graph_settings.colour_cluster_strength * graph.alpha;

    graph_active_edges(graph).forEach(function(edge) {
      const source_coloured = edge.source_node.field === state.colour_field;
      const target_coloured = edge.target_node.field === state.colour_field;
      let anchor = null;
      let follower = null;

      if (source_coloured && !target_coloured) {
        anchor = edge.source_node;
        follower = edge.target_node;
      } else if (target_coloured && !source_coloured) {
        anchor = edge.target_node;
        follower = edge.source_node;
      }

      if (!anchor || !follower || graph.dragging_node && graph.dragging_node.id === follower.id) {
        return;
      }

      follower.vx += (anchor.x - follower.x) * strength;
      follower.vy += (anchor.y - follower.y) * strength;
    });
  }

  function apply_link_force(graph) {
    graph_active_edges(graph).forEach(function(edge) {
      const source = edge.source_node;
      const target = edge.target_node;
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const distance = Math.max(1, Math.sqrt(dx * dx + dy * dy));
      const desired = link_distance_for_edge(edge);
      const drag_multiplier = graph.dragging_node && (
          graph.dragging_node.id === source.id || graph.dragging_node.id === target.id
      ) ? graph_settings.drag_link_multiplier : 1;
      const strength = link_strength_for_edge(edge) * graph.alpha * graph_link_kick_multiplier(graph) * drag_multiplier;
      const force = (distance - desired) * strength;
      const fx = (dx / distance) * force;
      const fy = (dy / distance) * force;

      if (!graph.dragging_node || graph.dragging_node.id !== source.id) {
        source.vx += fx;
        source.vy += fy;
      }

      if (!graph.dragging_node || graph.dragging_node.id !== target.id) {
        target.vx -= fx;
        target.vy -= fy;
      }
    });
  }

  function apply_charge_force(graph) {
    const nodes = graph_active_nodes(graph);

    for (let i = 0; i < nodes.length; i = i + 1) {
      for (let j = i + 1; j < nodes.length; j = j + 1) {
        const a = nodes[i];
        const b = nodes[j];
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let distance_sq = dx * dx + dy * dy;

        if (distance_sq < 1) {
          dx = 1;
          dy = 0;
          distance_sq = 1;
        }

        const distance = Math.sqrt(distance_sq);
        const drag_multiplier = graph.dragging_node && (
            graph.dragging_node.id === a.id || graph.dragging_node.id === b.id
        ) ? graph_settings.drag_charge_multiplier : 1;
        const pair_charge = charge_strength_for_pair(a, b, graph) * graph.alpha * graph_charge_kick_multiplier(graph) * drag_multiplier;
        const force = Math.min(
            graph_settings.charge_max_impulse,
            pair_charge / Math.max(graph_settings.charge_min_distance_sq, distance_sq)
        );
        const fx = (dx / distance) * force;
        const fy = (dy / distance) * force;

        if (!graph.dragging_node || graph.dragging_node.id !== a.id) {
          a.vx -= fx;
          a.vy -= fy;
        }

        if (!graph.dragging_node || graph.dragging_node.id !== b.id) {
          b.vx += fx;
          b.vy += fy;
        }
      }
    }
  }

  function centre_strength_for_node(node) {
    const metrics = node.metrics || graph_node_metrics(node);

    if (metrics.isolated || metrics.declared_empty_type) {
      return graph_settings.isolated_node_centre_strength;
    }

    if (metrics.hub) {
      return graph_settings.centre_strength * 0.85;
    }

    return graph_settings.centre_strength;
  }

  function apply_centre_force(graph) {
    const cx = graph.width / 2;
    const cy = graph.height / 2;

    graph_active_nodes(graph).forEach(function(node) {
      if (graph.dragging_node && graph.dragging_node.id === node.id) {
        return;
      }

      const strength = centre_strength_for_node(node) * graph.alpha;
      node.vx += (cx - node.x) * strength;
      node.vy += (cy - node.y) * strength;
    });
  }

  function collision_radius_for_node(node, graph) {
    const metrics = node.metrics || graph_node_metrics(node);
    const label_factor = zoom_fade(
        graph.zoom,
        graph_settings.node_label_visible_zoom,
        graph_settings.node_label_fade_range
    );

    return node.circle_collision_radius + metrics.label_bonus * label_factor;
  }

  function apply_collision_force(graph) {
    const nodes = graph_active_nodes(graph);

    for (let i = 0; i < nodes.length; i = i + 1) {
      for (let j = i + 1; j < nodes.length; j = j + 1) {
        const a = nodes[i];
        const b = nodes[j];
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        const minimum = collision_radius_for_node(a, graph) + collision_radius_for_node(b, graph);

        if (distance < 1) {
          dx = 1;
          dy = 0;
          distance = 1;
        }

        if (distance < minimum) {
          const push = ((minimum - distance) / distance) * 0.5 * graph.alpha * graph_settings.collision_strength;
          const fx = dx * push;
          const fy = dy * push;

          if (!graph.dragging_node || graph.dragging_node.id !== a.id) {
            a.vx -= fx;
            a.vy -= fy;
          }

          if (!graph.dragging_node || graph.dragging_node.id !== b.id) {
            b.vx += fx;
            b.vy += fy;
          }
        }
      }
    }
  }

  function apply_wall_force(node, graph) {
    const padding = graph_settings.wall_padding + (node.radius || graph_settings.node_radius);
    const left = padding;
    const right = graph.width - padding;
    const top = padding;
    const bottom = graph.height - padding;
    const strength = graph_settings.wall_return_strength * graph.alpha;

    if (node.x < left) {
      node.vx += (left - node.x) * strength;
      node.vx *= graph_settings.wall_velocity_decay;
    } else if (node.x > right) {
      node.vx -= (node.x - right) * strength;
      node.vx *= graph_settings.wall_velocity_decay;
    }

    if (node.y < top) {
      node.vy += (top - node.y) * strength;
      node.vy *= graph_settings.wall_velocity_decay;
    } else if (node.y > bottom) {
      node.vy -= (node.y - bottom) * strength;
      node.vy *= graph_settings.wall_velocity_decay;
    }

    node.x = clamp(node.x, -graph.width * graph_settings.wall_far_multiplier, graph.width * graph_settings.wall_far_multiplier);
    node.y = clamp(node.y, -graph.height * graph_settings.wall_far_multiplier, graph.height * graph_settings.wall_far_multiplier);
  }

  function integrate_positions(graph) {
    const decay = graph_settings.velocity_decay;

    graph_active_nodes(graph).forEach(function(node) {
      if (graph.dragging_node && graph.dragging_node.id === node.id) {
        return;
      }

      node.vx *= decay;
      node.vy *= decay;
      node.x = node.x + node.vx;
      node.y = node.y + node.vy;
      apply_wall_force(node, graph);
    });
  }

  function graph_is_at_rest(graph) {
    if (graph.dragging_node) {
      return false;
    }

    if (graph.alpha > graph_settings.rest_alpha) {
      return false;
    }

    return graph_active_nodes(graph).every(function(node) {
      const speed_sq = node.vx * node.vx + node.vy * node.vy;
      return speed_sq <= graph_settings.rest_velocity_sq;
    });
  }

  function graph_should_animate() {
    const graph = state.graph;

    return Boolean(
      graph &&
      graph.svg &&
      graph.svg.isConnected &&
      document.visibilityState !== "hidden"
    );
  }

  function simulation_tick(graph) {
    apply_link_force(graph);
    apply_colour_cluster_force(graph);
    apply_charge_force(graph);
    apply_centre_force(graph);
    apply_collision_force(graph);
    integrate_positions(graph);
    render_graph_scene();
    fit_graph_after_kick_if_ready(graph);

    const alpha_floor = graph_settings.ambient_motion && !prefers_reduced_motion()
        ? graph_settings.idle_alpha
        : 0;
    const decay = graph.dragging_node ? graph_settings.drag_alpha_decay : graph_settings.alpha_decay;

    graph.alpha = Math.max(alpha_floor, graph.alpha * decay);
  }

  function graph_animation_loop() {
    const graph = state.graph;

    if (graph) {
      graph.animation_frame = 0;
    }

    if (!graph || !graph_should_animate()) {
      return;
    }

    simulation_tick(graph);

    if (!graph_settings.ambient_motion && graph_is_at_rest(graph)) {
      return;
    }

    start_graph_animation();
  }

  function start_graph_animation() {
    const graph = state.graph;

    if (!graph || graph.animation_frame || !graph_should_animate()) {
      return;
    }

    graph.animation_frame = requestAnimationFrame(graph_animation_loop);
  }

  function stop_graph_animation() {
    const graph = state.graph;

    if (graph && graph.animation_frame) {
      cancelAnimationFrame(graph.animation_frame);
      graph.animation_frame = 0;
    }
  }

  function reheat_graph(alpha) {
    const graph = state.graph;

    if (!graph) {
      return;
    }

    const requested = prefers_reduced_motion()
        ? Math.min(alpha || graph_settings.view_reheat, graph_settings.rest_alpha * 8)
        : (alpha || graph_settings.view_reheat);

    graph.alpha = Math.max(graph.alpha || 0, requested);
  }

  function screen_to_world(client_x, client_y) {
    const graph = state.graph;
    const rect = graph.svg.getBoundingClientRect();
    const screen_x = client_x - rect.left;
    const screen_y = client_y - rect.top;

    return {
      x: (screen_x - graph.pan_x) / graph.zoom,
      y: (screen_y - graph.pan_y) / graph.zoom,
      screen_x: screen_x,
      screen_y: screen_y
    };
  }

  function zoom_at(screen_x, screen_y, next_zoom) {
    const graph = state.graph;

    if (!graph) {
      return;
    }

    const old_zoom = graph.zoom;
    const new_zoom = clamp(next_zoom, graph_settings.min_zoom, graph_settings.max_zoom);
    const world_x = (screen_x - graph.pan_x) / old_zoom;
    const world_y = (screen_y - graph.pan_y) / old_zoom;

    graph.zoom = new_zoom;
    graph.pan_x = screen_x - world_x * new_zoom;
    graph.pan_y = screen_y - world_y * new_zoom;
    render_graph_scene();
  }

  function zoom_from_centre(factor) {
    const graph = state.graph;

    if (!graph) {
      return;
    }

    zoom_at(graph.width / 2, graph.height / 2, graph.zoom * factor);
  }

  function fit_graph() {
    const graph = state.graph;

    const nodes = graph_active_nodes(graph);

    if (!graph || !nodes.length) {
      return;
    }

    const bounds = nodes.reduce(function(acc, node) {
      return {
        min_x: Math.min(acc.min_x, node.x - node.collision_radius),
        max_x: Math.max(acc.max_x, node.x + node.collision_radius),
        min_y: Math.min(acc.min_y, node.y - node.collision_radius),
        max_y: Math.max(acc.max_y, node.y + node.collision_radius)
      };
    }, {
      min_x: Infinity,
      max_x: -Infinity,
      min_y: Infinity,
      max_y: -Infinity
    });

    const box_width = Math.max(1, bounds.max_x - bounds.min_x);
    const box_height = Math.max(1, bounds.max_y - bounds.min_y);
    const scale = clamp(
        Math.min((graph.width - graph_settings.fit_padding) / box_width, (graph.height - graph_settings.fit_padding) / box_height),
        graph_settings.min_zoom,
        graph_settings.fit_max_zoom
    );
    const centre_x = (bounds.min_x + bounds.max_x) / 2;
    const centre_y = (bounds.min_y + bounds.max_y) / 2;

    graph.zoom = scale;
    graph.pan_x = graph.width / 2 - centre_x * scale;
    graph.pan_y = graph.height / 2 - centre_y * scale;
    render_graph_scene();
  }

  function reset_force_graph() {
    const graph = state.graph;

    if (!graph) {
      return;
    }

    graph.pointer = null;
    graph.dragging_node = null;
    graph.zoom = 1;
    graph.pan_x = 0;
    graph.pan_y = 0;

    graph.nodes.forEach(function(node, index) {
      const position = initial_node_position(node, index, graph.nodes.length, graph.width, graph.height);
      node.x = position.x;
      node.y = position.y;
      node.vx = 0;
      node.vy = 0;
    });

    state.selected = null;
    render_graph_scene();
    update_all_selection_surfaces();
    start_reset_kick(true);
    reheat_graph(graph_settings.reset_reheat);
    start_graph_animation();
  }

  function selection_node_ids() {
    if (!state.selected) {
      return new Set();
    }

    if (state.selected.type === "node") {
      const component = same_title_component_for_node(state.selected.id);
      return new Set(component ? component.node_ids : [state.selected.id]);
    }

    if (state.selected.type === "edge") {
      const edge = selected_edge_from_data(state.selected.id);
      const component = is_same_title_edge(edge) ? same_title_component_for_edge(edge) : null;

      if (component) {
        return new Set(component.node_ids);
      }

      return new Set([state.selected.source_id, state.selected.target_id].filter(Boolean));
    }

    return new Set();
  }

  function connected_ids_for_selection() {
    const graph = state.graph;
    const result = {
      nodes: new Set(),
      edges: new Set()
    };

    if (!graph || !state.selected) {
      return result;
    }

    const selected_nodes = selection_node_ids();

    selected_nodes.forEach(function(node_id) {
      result.nodes.add(node_id);
    });

    graph_active_edges(graph).forEach(function(edge) {
      if (selected_nodes.has(edge.source) || selected_nodes.has(edge.target)) {
        result.edges.add(edge.id);
        result.nodes.add(edge.source);
        result.nodes.add(edge.target);
      }
    });

    return result;
  }

  function connected_matrix_ids_for_selection() {
    const result = {
      nodes: new Set(),
      edges: new Set()
    };

    if (!state.selected) {
      return result;
    }

    const selected_nodes = selection_node_ids();

    selected_nodes.forEach(function(node_id) {
      result.nodes.add(node_id);
    });

    visible_edges().forEach(function(edge) {
      if (selected_nodes.has(edge.source) || selected_nodes.has(edge.target)) {
        result.edges.add(edge.id);
        result.nodes.add(edge.source);
        result.nodes.add(edge.target);
      }
    });

    if (state.selected.type === "edge" && !is_same_title_edge(selected_edge_from_data(state.selected.id))) {
      result.edges.add(state.selected.id);
      result.nodes.add(state.selected.source_id);
      result.nodes.add(state.selected.target_id);
    }

    return result;
  }

  function connected_colour_pair_for_node(node_id, connected_edge_ids) {
    const graph = state.graph;

    if (!graph || !connected_edge_ids || !connected_edge_ids.size) {
      return null;
    }

    const direct = colour_pair_for_node_id(node_id);

    if (direct) {
      return direct;
    }

    const edge = graph_active_edges(graph).find(function(item) {
      return connected_edge_ids.has(item.id) && (item.source === node_id || item.target === node_id);
    });

    return colour_pair_for_edge(edge);
  }

  function hovered_edge_from_data(edge_id) {
    if (state.graph) {
      const graph_edge = graph_active_edges(state.graph).find(function(item) {
        return item.id === edge_id;
      });

      if (graph_edge) {
        return graph_edge;
      }
    }

    const visible = visible_edge_ids();
    if (!visible.has(edge_id)) {
      return null;
    }

    return state.data.edges.find(function(item) {
      return item.id === edge_id;
    }) || null;
  }

  function hover_node_ids() {
    if (!state.hovered) {
      return new Set();
    }

    if (state.hovered.type === "node") {
      const component = same_title_component_for_node(state.hovered.id);
      return new Set(component ? component.node_ids : [state.hovered.id]);
    }

    if (state.hovered.type === "edge") {
      const edge = hovered_edge_from_data(state.hovered.id);
      const component = is_same_title_edge(edge) ? same_title_component_for_edge(edge) : null;

      if (component) {
        return new Set(component.node_ids);
      }

      if (edge) {
        return new Set([edge.source, edge.target].filter(Boolean));
      }
    }

    return new Set();
  }

  function connected_ids_for_hover(use_graph_edges) {
    const result = {
      nodes: new Set(),
      edges: new Set()
    };

    if (!state.hovered) {
      return result;
    }

    const hovered_nodes = hover_node_ids();

    hovered_nodes.forEach(function(node_id) {
      result.nodes.add(node_id);
    });

    if (state.hovered.type === "edge") {
      const edge = hovered_edge_from_data(state.hovered.id);

      if (edge) {
        result.edges.add(edge.id);
        result.nodes.add(edge.source);
        result.nodes.add(edge.target);
      }

      return result;
    }

    const edges = use_graph_edges && state.graph
        ? graph_active_edges(state.graph)
        : visible_edges();

    edges.forEach(function(edge) {
      if (hovered_nodes.has(edge.source) || hovered_nodes.has(edge.target)) {
        result.edges.add(edge.id);
        result.nodes.add(edge.source);
        result.nodes.add(edge.target);
      }
    });

    return result;
  }

  function set_hovered_node(node_id) {
    if (!node_id) {
      clear_hovered();
      return;
    }

    if (state.hovered && state.hovered.type === "node" && state.hovered.id === node_id) {
      return;
    }

    state.hovered = {
      type: "node",
      id: node_id
    };
    update_hover_surfaces();
  }

  function set_hovered_edge(edge_id) {
    if (!edge_id || !hovered_edge_from_data(edge_id)) {
      clear_hovered();
      return;
    }

    if (state.hovered && state.hovered.type === "edge" && state.hovered.id === edge_id) {
      return;
    }

    const edge = hovered_edge_from_data(edge_id);
    state.hovered = {
      type: "edge",
      id: edge.id,
      source_id: edge.source,
      target_id: edge.target
    };
    update_hover_surfaces();
  }

  function clear_hovered() {
    if (!state.hovered) {
      return;
    }

    state.hovered = null;
    update_hover_surfaces();
  }

  function update_hover_surfaces() {
    update_graph_hover_classes();
    update_matrix_hover_classes();
  }

  function update_graph_hover_classes() {
    const graph = state.graph;

    if (!graph) {
      return;
    }

    const connected = connected_ids_for_hover(true);
    const has_hover = Boolean(state.hovered && state.hovered.id);

    graph.nodes_layer.querySelectorAll(".graph_force_node").forEach(function(node_element) {
      const id = node_element.getAttribute("data-node-id");
      const is_hovered = has_hover && state.hovered.type === "node" && connected.nodes.has(id) && id === state.hovered.id;
      const is_connected = has_hover && connected.nodes.has(id) && !is_hovered;

      node_element.classList.toggle("is_hovered", is_hovered);
      node_element.classList.toggle("is_hover_connected", is_connected);
    });

    graph.edges_layer.querySelectorAll("[data-edge-id]").forEach(function(edge_element) {
      const id = edge_element.getAttribute("data-edge-id");
      const is_hovered = has_hover && state.hovered.type === "edge" && state.hovered.id === id;
      const is_connected = has_hover && connected.edges.has(id) && !is_hovered;

      edge_element.classList.toggle("is_hovered", is_hovered);
      edge_element.classList.toggle("is_hover_connected", is_connected);
    });

    update_graph_zoom_dependent_styles();
  }

  function update_matrix_hover_classes() {
    const connected = connected_ids_for_hover(false);
    const has_hover = Boolean(state.hovered && state.hovered.id);

    mount.querySelectorAll(".graph_matrix_cell[data-edge-id]").forEach(function(cell) {
      const edge_id = cell.getAttribute("data-edge-id");
      const source_id = cell.getAttribute("data-source-id");
      const target_id = cell.getAttribute("data-target-id");
      const is_hovered = has_hover && state.hovered.type === "edge" && state.hovered.id === edge_id;
      const is_connected = has_hover && !is_hovered && (
          connected.edges.has(edge_id) || connected.nodes.has(source_id) || connected.nodes.has(target_id)
      );

      cell.classList.toggle("is_hovered", is_hovered);
      cell.classList.toggle("is_hover_connected", is_connected);
    });

    mount.querySelectorAll(".graph_matrix th[data-row-node-id], .graph_matrix th[data-column-node-id]").forEach(function(header) {
      const row_id = header.getAttribute("data-row-node-id");
      const column_id = header.getAttribute("data-column-node-id");
      const id = row_id || column_id;
      const is_hovered = has_hover && state.hovered.type === "node" && state.hovered.id === id;
      const is_connected = has_hover && connected.nodes.has(id) && !is_hovered;

      header.classList.toggle("is_hovered", is_hovered);
      header.classList.toggle("is_hover_connected", is_connected);
    });
  }

  function update_edge_widths(edge_element, is_selected, is_connected) {
    if (edge_element.classList.contains("graph_force_edge_label")) {
      return;
    }

    if (edge_element.classList.contains("graph_force_edge_hit")) {
      edge_element.setAttribute("stroke-width", String(graph_settings.edge_hit_stroke_width));
      return;
    }

    if (is_selected) {
      edge_element.setAttribute("stroke-width", String(graph_settings.edge_selected_stroke_width));
      return;
    }

    if (is_connected) {
      edge_element.setAttribute("stroke-width", String(graph_settings.edge_connected_stroke_width));
      return;
    }

    edge_element.setAttribute("stroke-width", String(graph_settings.edge_stroke_width));
  }

  function update_graph_selection_classes() {
    const graph = state.graph;

    if (!graph) {
      return;
    }

    const connected = connected_ids_for_selection();
    const has_selection = Boolean(state.selected && state.selected.id);

    graph.nodes_layer.querySelectorAll(".graph_force_node").forEach(function(node_element) {
      const id = node_element.getAttribute("data-node-id");
      const is_selected = has_selection && state.selected.type === "node" && state.selected.id === id;
      const is_connected = connected.nodes.has(id);

      const connected_pair = is_selected || is_connected
          ? connected_colour_pair_for_node(id, connected.edges)
          : null;

      node_element.classList.toggle("is_selected", is_selected);
      node_element.classList.toggle("is_connected", is_connected && !is_selected);
      node_element.classList.toggle("is_dimmed", Boolean(has_selection && !is_connected));

      if (connected_pair) {
        node_element.style.setProperty("--graph-connected-colour-start", connected_pair.start);
        node_element.style.setProperty("--graph-connected-colour-end", connected_pair.end);
      } else {
        node_element.style.removeProperty("--graph-connected-colour-start");
        node_element.style.removeProperty("--graph-connected-colour-end");
      }
    });

    graph.edges_layer.querySelectorAll("[data-edge-id]").forEach(function(edge_element) {
      const id = edge_element.getAttribute("data-edge-id");
      const is_selected = has_selection && state.selected.type === "edge" && state.selected.id === id;
      const is_connected = connected.edges.has(id);

      edge_element.classList.toggle("is_selected", is_selected);
      edge_element.classList.toggle("is_connected", is_connected && !is_selected);
      edge_element.classList.toggle("is_dimmed", Boolean(has_selection && !is_connected));
      update_edge_widths(edge_element, is_selected, is_connected);
    });

    update_graph_zoom_dependent_styles();
  }

  function update_matrix_selection_classes() {
    const connected = connected_matrix_ids_for_selection();
    const has_selection = Boolean(state.selected && state.selected.id);

    mount.querySelectorAll(".graph_matrix_cell[data-edge-id]").forEach(function(cell) {
      const edge_id = cell.getAttribute("data-edge-id");
      const source_id = cell.getAttribute("data-source-id");
      const target_id = cell.getAttribute("data-target-id");
      const is_selected = has_selection && state.selected.type === "edge" && state.selected.id === edge_id;
      const is_connected = connected.edges.has(edge_id) || connected.nodes.has(source_id) || connected.nodes.has(target_id);

      cell.classList.toggle("is_selected", is_selected);
      cell.classList.toggle("is_connected", is_connected && !is_selected);
      cell.classList.toggle("is_dimmed", Boolean(has_selection && !is_connected));
    });

    mount.querySelectorAll(".graph_matrix th[data-row-node-id], .graph_matrix th[data-column-node-id]").forEach(function(header) {
      const row_id = header.getAttribute("data-row-node-id");
      const column_id = header.getAttribute("data-column-node-id");
      const id = row_id || column_id;
      const is_selected = has_selection && state.selected.type === "node" && state.selected.id === id;
      const is_connected = connected.nodes.has(id);

      header.classList.toggle("is_selected", is_selected);
      header.classList.toggle("is_connected", Boolean(has_selection && is_connected && !is_selected));
      header.classList.toggle("is_dimmed", Boolean(has_selection && !is_connected));
    });

  }

  function pointer_distance(pointer, event) {
    if (!pointer) {
      return 0;
    }

    const dx = event.clientX - pointer.start_x;
    const dy = event.clientY - pointer.start_y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function bind_force_graph_events() {
    const graph = state.graph;

    if (!graph) {
      return;
    }

    graph.svg.addEventListener("wheel", function(event) {
      event.preventDefault();

      const rect = graph.svg.getBoundingClientRect();
      const screen_x = event.clientX - rect.left;
      const screen_y = event.clientY - rect.top;
      const factor = Math.exp(-event.deltaY * graph_settings.wheel_zoom_sensitivity);

      zoom_at(screen_x, screen_y, graph.zoom * factor);
    }, { passive: false });

    graph.svg.addEventListener("pointerdown", function(event) {
      if (event.target.closest(".graph_force_node")) {
        return;
      }

      const edge_target = event.target.closest(".graph_force_edge_hit, .graph_force_edge");
      let edge = null;

      if (edge_target) {
        edge = graph.edges.find(function(item) {
          return item.id === edge_target.getAttribute("data-edge-id");
        }) || null;

        if (!edge || edge.is_visible === false || edge.source_node.is_visible === false || edge.target_node.is_visible === false) {
          return;
        }
      }

      event.preventDefault();
      graph.pointer = {
        type: edge ? "edge" : "background",
        edge_id: edge ? edge.id : "",
        start_x: event.clientX,
        start_y: event.clientY,
        pan_x: graph.pan_x,
        pan_y: graph.pan_y,
        dragging: false
      };
      graph.svg.setPointerCapture(event.pointerId);
    });

    graph.svg.addEventListener("pointermove", function(event) {
      if (!graph.pointer || (graph.pointer.type !== "background" && graph.pointer.type !== "edge")) {
        return;
      }

      const distance = pointer_distance(graph.pointer, event);

      if (!graph.pointer.dragging && distance < graph_settings.drag_threshold_px) {
        return;
      }

      graph.pointer.dragging = true;
      graph.svg.classList.add("is_panning");
      graph.pan_x = graph.pointer.pan_x + event.clientX - graph.pointer.start_x;
      graph.pan_y = graph.pointer.pan_y + event.clientY - graph.pointer.start_y;
      render_graph_scene();
    });

    graph.svg.addEventListener("pointerup", function(event) {
      if (!graph.pointer || (graph.pointer.type !== "background" && graph.pointer.type !== "edge")) {
        return;
      }

      const was_dragging = graph.pointer.dragging;
      const pointer_type = graph.pointer.type;
      const edge_id = graph.pointer.edge_id;
      graph.pointer = null;
      graph.svg.classList.remove("is_panning");

      if (graph.svg.hasPointerCapture(event.pointerId)) {
        graph.svg.releasePointerCapture(event.pointerId);
      }

      if (was_dragging) {
        return;
      }

      if (pointer_type === "edge" && edge_id) {
        toggle_selected_edge(edge_id);
        return;
      }

      clear_selection();
    });

    graph.svg.addEventListener("pointercancel", function(event) {
      graph.pointer = null;
      graph.dragging_node = null;
      graph.svg.classList.remove("is_panning");

      if (graph.svg.hasPointerCapture(event.pointerId)) {
        graph.svg.releasePointerCapture(event.pointerId);
      }
    });

    graph.nodes_layer.querySelectorAll(".graph_force_node").forEach(function(group) {
      group.addEventListener("pointerenter", function() {
        set_hovered_node(group.getAttribute("data-node-id"));
      });

      group.addEventListener("pointerleave", clear_hovered);

      group.addEventListener("pointerdown", function(event) {
        const node = graph.node_map.get(group.getAttribute("data-node-id"));

        if (!node || node.is_visible === false) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();
        graph.pointer = {
          type: "node",
          id: node.id,
          start_x: event.clientX,
          start_y: event.clientY,
          dragging: false
        };
        graph.dragging_node = node;
        group.setPointerCapture(event.pointerId);
      });

      group.addEventListener("pointermove", function(event) {
        const node = graph.dragging_node;

        if (!node || !graph.pointer || graph.pointer.type !== "node" || graph.pointer.id !== node.id) {
          return;
        }

        event.preventDefault();

        if (!graph.pointer.dragging && pointer_distance(graph.pointer, event) < graph_settings.drag_threshold_px) {
          return;
        }

        graph.pointer.dragging = true;
        group.classList.add("is_dragging");

        const world = screen_to_world(event.clientX, event.clientY);
        const previous_x = node.x;
        const previous_y = node.y;
        node.x = world.x;
        node.y = world.y;
        node.vx = (world.x - previous_x) * 0.35;
        node.vy = (world.y - previous_y) * 0.35;
        render_graph_scene();
        reheat_graph(graph_settings.drag_reheat);
        start_graph_animation();
      });

      group.addEventListener("pointerup", function(event) {
        const node_id = group.getAttribute("data-node-id");
        const node = graph.node_map.get(node_id);
        const was_dragging = Boolean(graph.pointer && graph.pointer.dragging);

        group.classList.remove("is_dragging");
        graph.pointer = null;
        graph.dragging_node = null;

        if (group.hasPointerCapture(event.pointerId)) {
          group.releasePointerCapture(event.pointerId);
        }

        if (was_dragging) {
          reheat_graph(graph_settings.drag_reheat);
          start_graph_animation();
          return;
        }

        if (!node || node.is_visible === false) {
          return;
        }

        toggle_selected_node(node_id);
      });

      group.addEventListener("keydown", function(event) {
        if (event.key === "Enter" || event.key === " ") {
          const node = graph.node_map.get(group.getAttribute("data-node-id"));

          if (!node || node.is_visible === false) {
            return;
          }

          event.preventDefault();
          toggle_selected_node(node.id);
        }
      });
    });

    const zoom_out = mount.querySelector("[data-graph-zoom-out]");
    const zoom_in = mount.querySelector("[data-graph-zoom-in]");
    const fit = mount.querySelector("[data-graph-fit]");
    const reset = mount.querySelector("[data-graph-reset]");

    if (zoom_out) {
      zoom_out.addEventListener("click", function() {
        zoom_from_centre(1 / graph_settings.button_zoom_step);
      });
    }

    if (zoom_in) {
      zoom_in.addEventListener("click", function() {
        zoom_from_centre(graph_settings.button_zoom_step);
      });
    }

    if (fit) {
      fit.addEventListener("click", fit_graph);
    }

    if (reset) {
      reset.addEventListener("click", reset_force_graph);
    }
  }

  document.addEventListener("visibilitychange", function() {
    if (document.visibilityState === "hidden") {
      stop_graph_animation();
      return;
    }

    if (state.graph && !graph_is_at_rest(state.graph)) {
      start_graph_animation();
    }
  });

  fetch("/metadata/graph-data.json")
      .then(function(response) {
        if (!response.ok) {
          throw new Error("Could not load metadata/graph-data.json");
        }

        return response.json();
      })
      .then(function(data) {
        state.data = data;
        rebuild_same_title_components();
        choose_initial_fields();
        render();
      })
      .catch(function(error) {
        mount.innerHTML = '<p class="muted">Graph data could not be loaded: ' + escape_html(error.message) + '</p>';
      });
}());
