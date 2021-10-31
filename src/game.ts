/// --- Set up a system ---

class RotatorSystem {
	// this group will contain every entity that has a Transform component
	group = engine.getComponentGroup(Transform);

	update(dt: number) {
		// iterate over the entities of the group
		for (let entity of this.group.entities) {
			// get the Transform component of the entity
			const transform = entity.getComponent(Transform);
			const material = entity.getComponent(Material);
			//const material = new Material();
			// entity.addComponent(material);

			// mutate the rotation
			// transform.rotate(Vector3.Up(), dt * 25);
			transform.rotate(Vector3.Left(), dt * 25);
			transform.rotate(Vector3.Down(), dt * 25);

			// transform.position.z = transform.position.z + dt * 0.5;
			// transform.position.x = transform.position.x + dt * 0.5;

			// true = forward | false = backwards
			const goingForward = material.data.direction;
			const maxHeight = material.data.maxHeight;
			const speed = material.data.speed;
			const brightness = material.data.brightness;

			if (goingForward) {
				transform.position.y = transform.position.y + dt * speed;
			} else {
				transform.position.y = transform.position.y - dt * speed;
			}

			// if reached top
			if (transform.position.y >= maxHeight) {
				material.data.direction = false;
				material.albedoColor = Color3.Lerp(
					Color3.Blue(),
					Color3.Gray(),
					brightness
				);
			}

			// if reached bottom
			if (transform.position.y <= 1) {
				material.data.direction = true;
				material.albedoColor = Color3.Lerp(
					Color3.Green(),
					Color3.Red(),
					brightness
				);
			}
		}
	}
}

// Add a new instance of the system to the engine
engine.addSystem(new RotatorSystem());

/// --- Spawner function ---

function spawnCube(x: number, y: number, z: number) {
	// create the entity
	const cube = new Entity();

	// add a transform to the entity
	cube.addComponent(new Transform({ position: new Vector3(x, y, z) }));

	// add a shape to the entity
	cube.addComponent(new BoxShape());

	const material = new Material();

	cube.addComponent(material);

	material.emissiveColor = Color3.Green();
	material.albedoColor = Color3.Lerp(Color3.Red(), Color3.Gray(), 15);
	material.ambientColor = Color3.Blue();
	material.reflectionColor = Color3.Green();
	material.dirty = true;
	material.data.direction = true;
	material.data.maxHeight = Math.floor(Math.random() * 10);
	material.data.speed = Math.floor(Math.random() * 5);
	material.data.brightness = Math.floor(Math.random() * 10);

	// add the entity to the engine
	engine.addEntity(cube);

	return cube;
}

/// --- Spawn a cube ---

const cube = spawnCube(8, 1, 8);

cube.addComponent(
	new OnClick(() => {
		cube.getComponent(Transform).scale.z *= 1.1;
		cube.getComponent(Transform).scale.x *= 0.9;

		spawnCube(Math.random() * 8 + 1, Math.random() * 8, Math.random() * 8 + 1);
	})
);
