import { NextRequest, NextResponse } from 'next/server';
import { saveDownloadRequest } from '@/lib/saveDownloadRequest';
import { insertDownloadRequestRow } from '@/lib/downloadRequestsDb';
import { sendOutboundEmailForRequest } from '@/lib/downloadEmail';
import {
  normalizeDownloadRequestTemplateId,
  resolveDownloadRequestTemplateId,
} from '@/lib/downloadRequestTemplate';
import { normalizeDownloadRequestDocumentIds } from '@/lib/downloadRequestDocument';
import { randomUUID } from 'crypto';
import {
  DOWNLOAD_REQUEST_JOB_TITLE_OPTIONS,
  DOWNLOAD_REQUEST_PURPOSE_OPTIONS,
} from '@/lib/downloadRequestShared';

const REQUEST_PURPOSE_SET = new Set<string>(DOWNLOAD_REQUEST_PURPOSE_OPTIONS);
const JOB_TITLE_SET = new Set<string>(DOWNLOAD_REQUEST_JOB_TITLE_OPTIONS);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const lastName =
      typeof body?.lastName === 'string' ? body.lastName.trim() : '';
    const firstName =
      typeof body?.firstName === 'string' ? body.firstName.trim() : '';
    const email = typeof body?.email === 'string' ? body.email.trim() : '';
    const company = typeof body?.company === 'string' ? body.company.trim() : '';
    const department =
      typeof body?.department === 'string' ? body.department.trim() : '';
    const phone = typeof body?.phone === 'string' ? body.phone.trim() : '';
    const requestPurpose =
      typeof body?.requestPurpose === 'string' ? body.requestPurpose.trim() : '';
    const questions =
      typeof body?.questions === 'string' ? body.questions.trim() : '';
    const privacyConsent = body?.privacyConsent === true;

    const name = [lastName, firstName].filter(Boolean).join(' ').trim();

    if (!lastName || !firstName) {
      return NextResponse.json(
        { error: '姓と名は必須です' },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: 'メールアドレスは必須です' },
        { status: 400 }
      );
    }

    if (!company) {
      return NextResponse.json(
        { error: '会社名は必須です' },
        { status: 400 }
      );
    }

    if (!phone) {
      return NextResponse.json(
        { error: '電話番号は必須です' },
        { status: 400 }
      );
    }

    if (!JOB_TITLE_SET.has(department)) {
      return NextResponse.json(
        { error: '役職を選択してください' },
        { status: 400 }
      );
    }

    if (!REQUEST_PURPOSE_SET.has(requestPurpose)) {
      return NextResponse.json(
        { error: '資料請求の目的を選択してください' },
        { status: 400 }
      );
    }

    if (!privacyConsent) {
      return NextResponse.json(
        { error: '個人情報の取扱いとプライバシーポリシーに同意してください' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '正しいメールアドレスを入力してください' },
        { status: 400 }
      );
    }

    const documentIds = await normalizeDownloadRequestDocumentIds(
      body?.documentIds,
      body?.documentId
    );
    const requestedTemplateId = await normalizeDownloadRequestTemplateId(body?.templateId);
    const templateId = await resolveDownloadRequestTemplateId({
      requestedTemplateId,
      documentIds,
    });

    const id = randomUUID();
    const timestamp = new Date().toISOString();

    await saveDownloadRequest({
      id,
      name,
      lastName,
      firstName,
      email,
      company,
      department,
      phone,
      requestPurpose,
      questions,
      privacyConsent,
      timestamp,
    });

    await insertDownloadRequestRow({
      id,
      name,
      lastName,
      firstName,
      email,
      company,
      department,
      phone,
      requestPurpose,
      questions,
      privacyConsent,
      requestedAt: timestamp,
      templateId,
      documentId: documentIds[0] ?? null,
      documentIds: documentIds.length > 0 ? documentIds : null,
    });

    await sendOutboundEmailForRequest(id);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Download request API error:', error);
    return NextResponse.json(
      { error: '送信中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
