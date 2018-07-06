import Dataloader from 'dataloader'
import participation from './participation'
import identity from './identity'
import boardActivity from './boardActivity'
import activeConversations from './activeConversations'

export default ({ cache = true }) => ({
  participation: new Dataloader(participation, { cache }),
  identity: new Dataloader(identity, { cache }),
  boardActivity: new Dataloader(boardActivity, { cache }),
  activeConversations: new Dataloader(activeConversations, { cache }),
})
