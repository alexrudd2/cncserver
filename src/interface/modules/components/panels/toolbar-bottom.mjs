/**
 * @file Bottom toolbar panel definition with bindings.
 */
import { html } from '/modules/hybrids.js';

export default styles => ({
  render: () => html`
    ${styles}

    <div class="is-pulled-right">
      <button-single
        title="Draw Preview"
        icon="star-half-alt"
        style="primary"
        onclick="cncserver.api.actions.drawPreview()"
      ></button-single>

      <button-toggle
        onchange="cncserver.api.buffer.toggle(this.state)"
        on-title="Pause"
        on-icon="pause"
        on-style="warning"
        off-title="Resume"
        off-icon="play"
        off-style="success"
        state
      ></button-toggle>

      <button-single
        title="Cancel"
        icon="trash-alt"
        style="danger"
        onclick="cncserver.api.buffer.clear()"
      ></button-single>
    </div>

    <label class="subtitle is-5 is-bold">Current Status</label>
    <progress class="progress is-primary is-large" value="0" max="100"></progress>
    <div class="subtitle has-text-centered has-text-dark" id="status">Idle...</div>
  `,
});
