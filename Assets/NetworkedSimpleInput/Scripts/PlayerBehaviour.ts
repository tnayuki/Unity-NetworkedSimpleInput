
namespace game {

    export class PlayerBehaviourFilter extends ut.EntityFilter {
        node: ut.Core2D.TransformNode;
        position?: ut.Core2D.TransformLocalPosition;
        rotation?: ut.Core2D.TransformLocalRotation;
        scale?: ut.Core2D.TransformLocalScale;
        movement: game.Movement;
    }

    export class PlayerBehaviour extends ut.ComponentBehaviour {
        data: PlayerBehaviourFilter;

        OnEntityEnable():void {
            NetworkManager.connect(this.world);
        }
    }
}
