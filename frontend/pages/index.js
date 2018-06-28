import { Page } from "../components/Page";
import { Text } from "../components/Text";
import { withApollo } from "components/ApolloProvider";

export default withApollo(() => (
  <Page>
    <Text>Index Page!</Text>
  </Page>
));
