import React from 'react';
import ReactDOM from 'react-dom';
import {injectIntl} from 'react-intl';
import {setAppElement} from 'react-modal';
import {compose} from 'redux';
import AppStateHOC from '../lib/app-state-hoc.jsx';
import ErrorBoundaryHOC from '../lib/error-boundary-hoc.jsx';
import GUI from '../containers/gui.jsx';
import {setProjectId} from '../reducers/project-state.js';
import {setPlayer} from '../reducers/mode.js';
import styles from './editor.css';

const WrappedGUI = compose(
    AppStateHOC,
    ErrorBoundaryHOC('Editor Integration'),
    injectIntl
)(GUI);

class EditorIntegration extends EventTarget {
    constructor () {
        super();

        /**
         * Root HTML element. React context lives inside here.
         * @type {HTMLElement}
         */
        this.root = document.createElement('div');
        this.root.className = styles.gui;
        setAppElement(this.root);

        // Supplied to the GUI on render.
        this._props = {
            // Default to project not being owned by user
            canSave: false,
            canEditTitle: false,

            // Enable "See project page" button in editor.
            enableCommunity: true,

            // This only controls the initial state. Future changes are handled in redux.
            isPlayerOnly: true,
        };

        // Do initial render so below logic works.
        this._render();

        /**
         * Internal redux store.
         */
        this.redux = window.ReduxStore; // ugly hack, but works

        /**
         * scratch-vm instance.
         */
        this.vm = this.redux.getState().scratchGui.vm;

        let previousState = this.redux.getState();
        this.redux.subscribe(() => {
            const newState = this.redux.getState();

            if (newState.scratchGui.mode.isPlayerOnly && !previousState.scratchGui.mode.isPlayerOnly) {
                this.dispatchEvent(new Event('exit-editor'));
            } else if (!newState.scratchGui.mode.isPlayerOnly && previousState.scratchGui.mode.isPlayerOnly) {
                this.dispatchEvent(new Event('enter-editor'));
            }

            previousState = newState;
        });
    }

    _render () {
        ReactDOM.render(<WrappedGUI {...this._props} />, this.root);
    }

    /**
     * Start loading a project using its ID.
     * @param {string} id
     */
    loadProjectById (id) {
        this.redux.dispatch(setProjectId(id));
    }

    /**
     * Toggle editor mode. You are expected to move the root element to a proper context on your own.
     * @param {boolean} isEditing
     */
    setInEditor (isEditing) {
        this.redux.dispatch(setPlayer(!isEditing));
    }

    /**
     * Toggle whether the user is allowed to try saving over the project. This usually corresponds to
     * the user "owning" the project instead of just being a viewer.
     * @param {boolean} canSave
     */
    setCanSave (canSave) {
        this._props.canSave = canSave;
        this._props.canEditTitle = canSave;
        this._render();
    }
}

export default EditorIntegration;
