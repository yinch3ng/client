// @flow
import * as Types from '../../../constants/types/chat2'
import * as Constants from '../../../constants/chat2'
import * as TrackerGen from '../../../actions/tracker-gen'
import Normal from '.'
import {compose, connect, withStateHandlers, type TypedState} from '../../../util/container'

const mapStateToProps = (state: TypedState, {conversationIDKey}) => {
  const showLoader = !!state.chat2.loadingMap.get(`loadingThread:${conversationIDKey}`)
  const meta = Constants.getMeta(state, conversationIDKey)
  return {conversationIDKey, showLoader, threadLoadedOffline: meta.offline}
}

const mapDispatchToProps = (dispatch: Dispatch, {navigateUp, navigateAppend}) => ({
  _onAttach: (conversationIDKey: Types.ConversationIDKey, paths: Array<string>) =>
    dispatch(navigateAppend([{props: {conversationIDKey, paths}, selected: 'attachmentGetTitles'}])),
  _onOpenInfoPanelMobile: (conversationIDKey: Types.ConversationIDKey) =>
    dispatch(navigateAppend([{props: {conversationIDKey}, selected: 'infoPanel'}])),
  onShowTracker: (username: string) =>
    dispatch(TrackerGen.createGetProfile({forceDisplay: true, ignoreCache: false, username})),
})

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    conversationIDKey: stateProps.conversationIDKey,
    navigateAppend: ownProps.navigateAppend,
    navigateUp: ownProps.navigateUp,
    onAttach: (paths: Array<string>) => dispatchProps._onAttach(stateProps.conversationIDKey, paths),
    onOpenInfoPanelMobile: () => dispatchProps._onOpenInfoPanelMobile(stateProps.conversationIDKey),
    onShowTracker: dispatchProps.onShowTracker,
    showLoader: stateProps.showLoader,
    threadLoadedOffline: stateProps.threadLoadedOffline,
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps, mergeProps),
  withStateHandlers(
    {focusInputCounter: 0, listScrollDownCounter: 0},
    {
      onFocusInput: ({focusInputCounter}) => () => ({focusInputCounter: focusInputCounter + 1}),
      onScrollDown: ({listScrollDownCounter}) => () => ({listScrollDownCounter: listScrollDownCounter + 1}),
    }
  )
)(Normal)
