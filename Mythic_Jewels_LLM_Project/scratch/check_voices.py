import asyncio
import edge_tts

async def main():
    voices = await edge_tts.list_voices()
    for v in voices:
        if 'tr-TR' in v['ShortName']:
            print(v['ShortName'], v['Gender'], v.get('VoiceType', ''))

if __name__ == '__main__':
    asyncio.run(main())
