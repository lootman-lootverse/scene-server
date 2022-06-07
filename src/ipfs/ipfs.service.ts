import { Injectable } from '@nestjs/common';
import axios from 'axios';
import FormData from 'form-data';

@Injectable()
export class IpfsService {
  async add(opts: {
    content: string;
  }): Promise<{ Size: string; Name: string; Hash: string }> {
    const formData = new FormData();
    formData.append('file', opts.content);
    const resp = await axios.post('http://127.0.0.1:5001/api/v0/add', formData);
    return resp.data;
  }
}
