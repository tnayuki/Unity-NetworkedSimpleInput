
namespace game {
    document.write('<script src="Photon-Javascript_SDK.min.js"></script>');

    export class NetworkManager {
        static client;

        static connect(world: ut.World) {
            this.client = new Photon.LoadBalancing.LoadBalancingClient(Photon.ConnectionProtocol.Wss, "d9d20e65-7169-4f6e-8aff-6cd14a5d6bb8", "1.0");
    
            this.client.onRoomList = this.client.onRoomListUpdate = (rooms) => {
                if (rooms.length > 0 && !this.client.isJoinedToRoom()) {
                    this.client.joinRoom("Room");
                } else if (this.client.isInLobby()) {
                    this.client.createRoom("Room");
                }
            };

            this.client.actorFactory = (name, actorNr, isLocal) => {
                const actor = new Photon.LoadBalancing.Actor(name, actorNr, isLocal);

                if (!isLocal && actorNr != -1) {
                    const entity = ut.EntityGroup.instantiate(world, "game.OtherSquare")[0];

                    const networkMovement = world.getComponentData(entity, game.NetworkMovement);
                    networkMovement.actorNr = actor.actorNr;
                    world.setComponentData(entity, networkMovement);
                }

                return actor;
            };

            this.client.onActorJoin = (actor) => {
                if (!actor.isLocal) {
                    const entity = ut.EntityGroup.instantiate(world, "game.OtherSquare")[0];

                    const networkMovement = world.getComponentData(entity, game.NetworkMovement);
                    networkMovement.actorNr = actor.actorNr;
                    world.setComponentData(entity, networkMovement);
                }
        };

            this.client.onActorLeave = (actor) => {
                world.forEach([ ut.Entity, game.NetworkMovement ], (entity, networkMovement) => {
                    if (networkMovement.actorNr == actor.actorNr) {
                        world.destroyEntity(entity);
                    }
                 });       
            };

            this.client.onEvent = (code, content, actorNr) => {
                if (code == 1) {
                    world.forEach([ut.Core2D.TransformLocalPosition, game.NetworkMovement], (transformLocalPosition, networkMovement) => {
                        if (networkMovement.actorNr == actorNr) {
                            transformLocalPosition.position = content;
                        }
                    });
                }
            };

            this.client.connectToRegionMaster("JP");
        }

        static updatePlayerPosition(position) {
            this.client.myActor().raiseEvent(1, position);
        }
    }
}
