import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import filesize from 'filesize';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [filesToUpload, setFilesToUpload] = useState<FileProps[]>([]);
  const history = useHistory();

  async function handleUpload(): Promise<void> {
    if (!filesToUpload.length) return;

    const file = filesToUpload[0];
    const data = new FormData();
    data.append('file', file.file, file.name);

    try {
      await api.post('/transactions/import', data);

      setFilesToUpload([]);
      history.push('/');
    } catch (err) {
      console.error(err.response.error);
    }
  }

  function attachFiles(files: File[]): void {
    const serializedFiles = files.map(file => ({
      file,
      name: file.name,
      readableSize: filesize(file.size),
    }));

    setFilesToUpload(serializedFiles);
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={attachFiles} />
          {!!filesToUpload.length && <FileList files={filesToUpload} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
