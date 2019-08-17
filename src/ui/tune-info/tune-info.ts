import "./tune-info.scss";
import defaultTunes from "../../defaultTunes";
import Vue from "vue";
import Component from "vue-class-component";
import template from "./tune-info.vue";
import $ from "jquery";
import config from "../../config";
import { InjectReactive, Prop, Watch } from "vue-property-decorator";
import { State } from "../../state/state";
import { Tune } from "../../state/tune";
import { PlaybackSettings } from "../../state/playbackSettings";
import { clone } from "../../utils";
import PlaybackSettingsComponent from "../playback-settings/playback-settings";
import PatternPlaceholder from "../pattern-placeholder/pattern-placeholder";
import { registerMultipleHandlers } from "../../services/events";

export function getTuneDescription(tuneName: string): string | null {
	if(!defaultTunes[tuneName])
		return null;

	// Use HTML from default tunes to avoid script injection through bbHistory
	let el = $("<div/>").html(defaultTunes[tuneName].description || "");
	el.find("a").attr("target", "_blank");
	return el.html();
}

@Component({
	template,
	components: { PlaybackSettings: PlaybackSettingsComponent, PatternPlaceholder }
})
export default class TuneInfo extends Vue {

	@InjectReactive() readonly state!: State;

	@Prop({ type: String, required: true }) readonly tuneName!: string;

	playbackSettings: PlaybackSettings = null as any;

	created() {
		this.playbackSettings = clone(this.state.playbackSettings);
	}

	get tuneDescription() {
		return getTuneDescription(this.tuneName);
	}

	get tune() {
		return this.tuneName && this.state.tunes[this.tuneName];
	}

	@Watch("tuneName")
	onTuneNameChange(tuneName: string, previousTuneName: string) {
		if(this.tune) {
			let previousDefaultSpeed = previousTuneName && this.state.tunes[previousTuneName].speed || config.defaultSpeed;
			if(this.playbackSettings.speed == previousDefaultSpeed)
				this.playbackSettings.speed = this.tune.speed || config.defaultSpeed;
		}
	}

}