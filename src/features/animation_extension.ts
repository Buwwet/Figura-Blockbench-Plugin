import { deleteLater, PLUGIN_ID } from "../figura";


//const Animation = _Animation; // For that type goddness



export function setup_animation_extension() {
    // I hate that we have to do this! It breaks type anotations big time.
    const Animation = (Blockbench as any).Animation;

    // Store new properties on _Animation
    deleteLater(new Property(Animation, 'number', 'priority', {default: 1, condition: {format: [PLUGIN_ID]}}));
    deleteLater(new Property(Animation, 'string', 'anim_type', {default: "NONE", condition: {format: [PLUGIN_ID]}}));

    // Priority
    let priority_action = new Action('figura_anims_priority', {
        name: "Figura- Priority",
        description: "Click to set the priority of the animation. Animators with higher priority play over those with lower priority.",
        condition: {
            formats: [PLUGIN_ID],
            method() {
                // Copying mimic_part's killer method.
                priority_action.setName("Figura - Priority: " + Animation.selected.priority);
                return true;
            }
        },
        click() {
            Blockbench.textPrompt("Set the priority of this animation. Must be a whole number.",
                Animation.selected.priority.toString(), 
                given => {
                    let num = parseInt(given);
                    // parseInt can return NaN
                    if (!Number.isNaN(num)) {
                        Animation.selected.priority = parseInt(given);
                    }
                }
            );
        }
        
    });

    // TYPE
    let current_anim_action_type = new Action('figura_anims_current_action', {
        name: "Current: [NONE]",
        description: "Click to set one manually.",
        click() {

        }
    })

    let anim_action_type = new Action('figura_anims_action_type', {
        name: "Animation Type",
        description: "Choose the animation's action type, it determines when it will run automatically.",
        condition: {
            formats: [PLUGIN_ID],
            method() {
                // Borrowing once again, this is absolutely busted.
                current_anim_action_type.setName(
                    "Current: [" + (Animation.selected.anim_type || "NONE") + "]"
                );
                return true;
            }
        },
        click() {
            Blockbench.textPrompt("Set the animation's action type manually. Example: WALK/CROUCH. Or leave empty for none.",
                Animation.selected.anim_type || '',
                given => {
                    if (given == '') {
                        Animation.selected.anim_type = undefined;
                    } else {
                        Animation.selected.anim_type = given;
                    }
                }
            )
        },
        children: [current_anim_action_type, ...animTypeButtons()]
    });

    // TODO: regular actions
    Animation.prototype.menu.structure.push(new MenuSeparator());
    //@ts-ignore
    Animation.prototype.menu.addAction(priority_action);
    Animation.prototype.menu.addAction(anim_action_type);

}

function animTypeButtons(): any[] {
    const Animation = (Blockbench as any).Animation;

    return ANIM_TYPES.map(val => {
        return new Action('figura_anims_action_type_set_' + val, {
            name: val,
            click() {
                Animation.selected.anim_type = val;
            }
        })
    })
}


// TODO: Might be nicer to split this into MOVEMENT/ACTIONS instead of having one big list.
const ANIM_TYPES = ["WALK", "SPRINT", "CROUCH", "CROUCHWALK", "TODO"]