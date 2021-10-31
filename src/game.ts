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

			const goingForward = material.data.direction;
			const maxHeight = material.data.maxHeight;
			const minHeight = material.data.minHeight;
			const speed = material.data.speed;
			const brightness = material.data.brightness;
			const canMove = material.data.canMove;
			const fromColor = material.data.fromColor;
			const toColor = material.data.toColor;
			const floatMultiplier = material.data.floatMultiplier;

			const currentColor = (material.albedoColor as Color3) ?? Color3.Red();

			transform.rotate(Vector3.Left(), speed * dt);
			transform.rotate(Vector3.Down(), speed * dt);
			transform.rotate(Vector3.One(), speed * dt);

			if (canMove) {
				// transform.position.z = transform.position.z + dt * 0.5;
				// transform.position.x = transform.position.x + dt * 0.5;

				// true = forward | false = backwards

				if (goingForward) {
					transform.position.y = transform.position.y + dt * floatMultiplier;
					material.ambientColor = Color3.Lerp(currentColor, toColor, 1);
				} else {
					transform.position.y = transform.position.y - dt * floatMultiplier;

					material.ambientColor = Color3.Lerp(currentColor, fromColor, 1);
				}

				// if reached top
				if (transform.position.y >= maxHeight) {
					material.data.direction = false;
					// material.ambientColor = Color3.Lerp(currentColor, Color3.Green(), 1);
				}

				// if reached bottom
				if (transform.position.y <= minHeight) {
					material.data.direction = true;
					// material.ambientColor = Color3.Lerp(currentColor, Color3.Red(), 1);
				}
			}
		}
	}
}

// Add a new instance of the system to the engine
engine.addSystem(new RotatorSystem());

/// --- Spawner function ---

function spawnCube(
	x: number,
	y: number,
	z: number,
	canMove = true,
	minHeight = 1,
	maxHeight = 2,
	floatMultiplier = 5
) {
	// create the entity
	const cube = new Entity();

	// add a transform to the entity
	cube.addComponent(new Transform({ position: new Vector3(x, y, z) }));

	// add a shape to the entity
	cube.addComponent(new BoxShape());

	const material = new Material();

	cube.addComponent(material);

	material.emissiveColor = Color3.Purple();
	// material.albedoColor = Color3.Lerp(Color3.Red(), Color3.Blue(), 15);
	material.reflectionColor = Color3.Green();

	material.data.canMove = canMove;
	material.data.direction = true;
	material.data.minHeight = minHeight;
	material.data.maxHeight = maxHeight;
	material.data.speed = 25;
	material.data.floatMultiplier = floatMultiplier;
	material.data.brightness = Math.floor(Math.random() * 5);
	material.data.fromColor = Color3.Red();

	// material.data.fromColor = new Color3(
	// 	Math.round(Math.random() * 60),
	// 	Math.round(Math.random() * 60),
	// 	Math.round(Math.random() * 60)
	// );

	material.data.toColor = Color3.Green();
	// material.data.toColor = new Color3(
	// 	Math.round(Math.random() * 60),
	// 	Math.round(Math.random() * 60),
	// 	Math.round(Math.random() * 60)
	// );

	material.ambientColor = Color3.Blue();

	material.albedoColor = Color3.Lerp(
		material.data.fromColor,
		material.data.toColor,
		5
	);

	material.alphaTest = 0.5;

	// add the entity to the engine
	engine.addEntity(cube);

	return cube;
}

/// --- Spawn a cube ---

const cube = spawnCube(8, 1, 8, false);

const playerCube = spawnCube(0, 2, 0, true, 1.5, 2, 0.5);

playerCube.setParent(Attachable.AVATAR);

const scale = 0.25;

playerCube.getComponent(Transform).scale.setAll(scale);

cube.addComponent(
	new OnClick(() => {
		const cubeVisible = playerCube.getComponent(Transform).scale.x === scale;
		playerCube.getComponent(Transform).scale.setAll(cubeVisible ? 0 : scale);
	})
);
