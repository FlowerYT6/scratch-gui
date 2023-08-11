import {defineMessages, FormattedMessage, intlShape, injectIntl} from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import Modal from '../../containers/modal.jsx';
import RestorePoint from './restore-point.jsx';
import styles from './restore-point-modal.css';
import classNames from 'classnames';
import {APP_NAME} from '../../lib/brand';
import {formatBytes} from '../../lib/tw-bytes-utils';

const messages = defineMessages({
    title: {
        defaultMessage: 'Restore Points',
        description: 'Title of restore point management modal',
        id: 'tw.restorePoints.title'
    }
});

const RestorePointModal = props => (
    <Modal
        className={styles.modalContent}
        onRequestClose={props.onClose}
        contentLabel={props.intl.formatMessage(messages.title)}
        id="restorePointModal"
    >
        <div className={styles.body}>
            <p>
                <FormattedMessage
                    // eslint-disable-next-line max-len
                    defaultMessage="{APP_NAME} periodically saves restore points on your computer to help recover your project if you forget to save. This is intended as a last resort for recovery. Your computer may silently delete these restore points at any time. DO NOT rely on this feature."
                    id="tw.restorePoints.description"
                    values={{
                        APP_NAME: APP_NAME
                    }}
                />
            </p>

            {props.disabled && (
                <p className={styles.disabled}>
                    <FormattedMessage
                        // eslint-disable-next-line max-len
                        defaultMessage="Disable the &quot;Disable restore points&quot; addon to re-enable restore point creation."
                        // eslint-disable-next-line max-len
                        description="Message that appears in restore point manager when the user has disabled restore points. Note that the name of the addon in the addon settings is currently hardcoded as English."
                        id="tw.restorePoints.disabled"
                    />
                </p>
            )}

            {props.error ? (
                <div className={styles.error}>
                    <p>
                        <FormattedMessage
                            defaultMessage="Restore points are not available due to an error:"
                            // eslint-disable-next-line max-len
                            description="Error message in restore point manager when the list of restore points cannot be loaded. Followed by an error message."
                            id="tw.restorePoints.error"
                            values={{
                                error: props.error
                            }}
                        />
                    </p>
                    <p className={styles.errorMessage}>
                        {props.error}
                    </p>
                </div>
            ) : props.isLoading ? (
                <div className={styles.loading}>
                    <FormattedMessage
                        defaultMessage="Loading..."
                        description="Loading message in restore point manager"
                        id="tw.restorePoints.loading"
                    />
                </div>
            ) : props.restorePoints.length === 0 ? (
                <div>
                    <div className={styles.empty}>
                        <FormattedMessage
                            defaultMessage="No restore points found."
                            description="Message that appears when no restore points exist yet"
                            id="tw.restorePoints.empty"
                        />
                    </div>
                </div>
            ) : (
                <div>
                    <div className={styles.restorePointContainer}>
                        {props.restorePoints.map(restorePoint => (
                            <RestorePoint
                                key={restorePoint.id}
                                onClickDelete={props.onClickDelete}
                                onClickLoad={props.onClickLoad}
                                {...restorePoint}
                            />
                        ))}
                    </div>

                    <div className={styles.extraContainer}>
                        <div className={styles.totalSize}>
                            <div>
                                <FormattedMessage
                                    defaultMessage="Estimated storage used: {size}"
                                    description="Part of restore point modal describing amount of disk space used"
                                    id="tw.restorePoints.size"
                                    values={{
                                        size: formatBytes(props.totalSize)
                                    }}
                                />
                            </div>
                            <div className={styles.totalSizeDescription}>
                                <FormattedMessage
                                    // eslint-disable-next-line max-len
                                    defaultMessage="Costumes or sounds used by multiple restore points are only stored once."
                                    // eslint-disable-next-line max-len
                                    description="Part of the restore point modal that explains why the total storage used is less than may be expected."
                                    id="tw.restorePoints.size2"
                                />
                            </div>
                        </div>

                        <button
                            onClick={props.onClickDeleteAll}
                            className={classNames(styles.button, styles.deleteAllButton)}
                            disabled={props.isLoading}
                        >
                            <FormattedMessage
                                defaultMessage="Delete All"
                                description="Button to delete all restore points"
                                id="tw.restorePoints.deleteAll"
                            />
                        </button>
                    </div>
                </div>
            )}

            {!props.isLoading && props.onClickLoadLegacy && (
                <details className={styles.legacyTransition}>
                    {/* This is going away within a few days */}
                    {/* No reason to bother translating */}
                    <summary>
                        {'Don\'t see your project?'}
                    </summary>
                    <p>
                        {/* eslint-disable-next-line max-len */}
                        {`If a restore point was made by an older version of ${APP_NAME}, it may not appear in the list. Please try clicking this button:`}
                    </p>
                    <button
                        className={classNames(styles.button, styles.loadLegacyButton)}
                        onClick={props.onClickLoadLegacy}
                    >
                        {'Load Legacy Restore Point'}
                    </button>
                </details>
            )}
        </div>
    </Modal>
);

RestorePointModal.propTypes = {
    intl: intlShape,
    onClose: PropTypes.func.isRequired,
    onClickCreate: PropTypes.func.isRequired,
    onClickDelete: PropTypes.func.isRequired,
    onClickDeleteAll: PropTypes.func.isRequired,
    onClickLoad: PropTypes.func.isRequired,
    onClickLoadLegacy: PropTypes.func,
    disabled: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    totalSize: PropTypes.number.isRequired,
    restorePoints: PropTypes.arrayOf(PropTypes.shape({})),
    error: PropTypes.string
};

export default injectIntl(RestorePointModal);
