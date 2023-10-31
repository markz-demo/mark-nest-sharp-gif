import { Body, Controller, Get, Post, Res, UseInterceptors, UploadedFile } from '@nestjs/common';
import type { Response } from 'express';
import { AppService } from './app.service';
import fetch from 'node-fetch';
import * as sharp from 'sharp';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test1')
  async test1(
    @Res() res: Response
  ) {

    const url = "https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eb1e0ec360f041729bde3420d0988b45~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=300&h=240&s=1541600&e=gif&f=30&b=8c7c5b";
    // 用fetch获取gif文件流
    const image1 = await fetch(url);
    const gifBuffer = await image1.buffer();

    // 用sharp获取图片高宽
    const image = await sharp(gifBuffer, { animated: true });
    const metadata = await image.metadata();

    const width = metadata.width;
    const height = metadata.pageHeight; // 注意是pageHeight，不是height
    const text = '不错不错';
    const x = width / 2;
    const y = 50;
    const fontFamily = 'Arial, sans-serif';
    const fontSize = 30;
    const color = 'white';
    const stroke = 'red';

    // 获取svg buffer，注意需要设置svg的高宽同原图一致
    const textImage = Buffer.from(`
  <svg width="${width}px" height="${height}px" xmlns="http://www.w3.org/2000/svg">
      <text
        text-anchor="middle"
        y="${y}" x="${x}"
        font-family="${fontFamily}"
        font-size="${fontSize}px"
        fill="${color}"
        stroke="${stroke}"
        >${text}</text>
  </svg>`
    );
    const buffer = await image
      .composite([
        { input: textImage, tile: true } // 可以添加多个图层
      ])
      .toBuffer();

    // response输出文件流
    res.set('Content-Type', 'image/gif');
    res.send(buffer);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async gifAddTextsUpload(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response
  ) {

    const image = await sharp(file.buffer, { animated: true });
    const metadata = await image.metadata();

    const width = metadata.width;
    const height = metadata.pageHeight; // 注意是pageHeight，不是height
    const text = '不错不错';
    const x = width / 2;
    const y = 50;
    const fontFamily = 'Arial, sans-serif';
    const fontSize = 30;
    const color = 'white';
    const stroke = 'red';

    // 获取svg buffer，注意需要设置svg的高宽同原图一致
    const textImage = Buffer.from(`
  <svg width="${width}px" height="${height}px" xmlns="http://www.w3.org/2000/svg">
      <text
        text-anchor="middle"
        y="${y}" x="${x}"
        font-family="${fontFamily}"
        font-size="${fontSize}px"
        fill="${color}"
        stroke="${stroke}"
        >${text}</text>
  </svg>`
    );
    const buffer = await image
      .composite([
        { input: textImage, tile: true } // 可以添加多个图层
      ])
      .toBuffer();

    // response输出文件流
    res.set('Content-Type', 'image/gif');
    res.send(buffer);
  }
}
