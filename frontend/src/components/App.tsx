import Paper from '@material-ui/core/Paper';
import * as React from 'react';

import Header from "./Header";
import RepositoryList from "./RepositoryList";
import { apiClient } from '../utils/ApiClient';
import { Repository } from "../interfaces";
import ButtonArea from "./ButtonArea";

interface State {
  language: string;
  loading: boolean;
  repos: Repository[];
  pageInfo: {
    endCursor?: string;
    hasNextPage: boolean;
  };
  repositoryCount?: number;
}

class App extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      loading: true,
      repos: [],
      language: 'javascript',
      pageInfo: {
        endCursor: undefined,
        hasNextPage: true,
      },
      repositoryCount: undefined,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  public async fetchRepos(language: string = this.state!.language) {
    this.setState((prevState) => {
      return {
        ...prevState,
        loading: true,
      }
    });

    const perPage = 10;
    const params = {
      language,
      perPage,
      endCursor: this.state!.pageInfo.endCursor,
    };
    const response = await apiClient.get('issues', {params});
    const repos = response.data.data.search.nodes;
    const pageInfo = response.data.data.search.pageInfo;
    const repositoryCount = response.data.data.search.repositoryCount;

    this.setState((prevState) => {
      return {
        ...prevState,
        loading: false,
        repos: prevState.repos.concat(repos),
        pageInfo,
        repositoryCount,
      }
    });
  }

  public componentDidMount() {
    this.fetchRepos()
  }

  public handleChange(event: any) {
    const language = event.target.value;
    this.setState((prevState) => {
      return {
        ...prevState,
        language,
        repos: [],
        loading: true,
        pageInfo: {
          endCursor: undefined,
          hasNextPage: true,
        },
        repositoryCount: undefined,
      };
    });
    this.fetchRepos(language);
  }

  public handleClick() {
    this.fetchRepos()
  }

  public render() {
    return (
      <Paper elevation={1}>
        <Header language={this.state!.language} handleChange={this.handleChange}/>
        <RepositoryList loading={this.state!.loading} repos={this.state!.repos}/>
        <ButtonArea loading={this.state!.loading} handleClick={this.handleClick} hasNextPage={this.state!.pageInfo.hasNextPage}/>
      </Paper>
    );
  }
}

export default App;
