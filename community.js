(function () {
  'use strict';

  const invitationUrl = new URL('community.html', window.location.href).href;
  const invitationText = `Join Nanati Abdisa's developer community: ${invitationUrl}`;

  const inviteUrlElement = document.getElementById('comm-invite-url-text');
  if (inviteUrlElement) {
    inviteUrlElement.href = invitationUrl;
    inviteUrlElement.textContent = invitationUrl;
  }

  const joinLink = document.getElementById('community-join-link');
  if (joinLink) joinLink.href = invitationUrl;

  const whatsappLink = document.getElementById('btn-share-whatsapp');
  if (whatsappLink) {
    whatsappLink.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(invitationText)}`;
  }

  const telegramLink = document.getElementById('btn-share-telegram');
  if (telegramLink) {
    telegramLink.href = `https://t.me/share/url?url=${encodeURIComponent(invitationUrl)}&text=${encodeURIComponent("Join Nanati Abdisa's developer community")}`;
  }

  const linkedInLink = document.getElementById('btn-share-linkedin');
  if (linkedInLink) {
    linkedInLink.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(invitationUrl)}`;
  }

  const copyStatus = document.getElementById('community-copy-status');
  const showCopyStatus = (message) => {
    if (copyStatus) copyStatus.textContent = message;
  };

  const copyInvitationLink = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(invitationUrl);
      } else {
        const temporaryInput = document.createElement('textarea');
        temporaryInput.value = invitationUrl;
        temporaryInput.setAttribute('readonly', '');
        temporaryInput.style.position = 'fixed';
        temporaryInput.style.opacity = '0';
        document.body.appendChild(temporaryInput);
        temporaryInput.select();
        const copied = document.execCommand('copy');
        temporaryInput.remove();
        if (!copied) throw new Error('Clipboard access is unavailable.');
      }
      showCopyStatus('Invitation link copied.');
    } catch (error) {
      showCopyStatus('Could not copy the link. Please copy it from the invitation field.');
      console.error('Unable to copy the community invitation link:', error);
    }
  };

  document.querySelectorAll('[data-copy-invite]').forEach((button) => {
    button.addEventListener('click', copyInvitationLink);
  });

  const nativeShareButton = document.getElementById('btn-native-share');
  if (nativeShareButton) {
    nativeShareButton.addEventListener('click', async () => {
      if (!navigator.share) {
        await copyInvitationLink();
        return;
      }

      try {
        await navigator.share({
          title: "Nanati Abdisa's Developer Community",
          text: "Join Nanati Abdisa's developer community",
          url: invitationUrl,
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          showCopyStatus('Unable to open the share dialog.');
          console.error('Unable to share the community invitation:', error);
        }
      }
    });
  }

  const registrationForm = document.getElementById('comm-registration-form');
  if (registrationForm) {
    const githubUsername = document.getElementById('comm-input-github');
    const githubUrl = document.getElementById('comm-input-url');
    const formStatus = document.getElementById('community-form-status');
    const submitButton = registrationForm.querySelector('[type="submit"]');

    githubUsername.addEventListener('input', () => {
      const username = githubUsername.value.trim().replace(/^@/, '');
      githubUrl.value = username ? `https://github.com/${username}` : '';
    });

    registrationForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      formStatus.textContent = '';
      submitButton.disabled = true;

      const username = githubUsername.value.trim().replace(/^@/, '');
      const payload = {
        name: document.getElementById('comm-input-name').value.trim(),
        githubUsername: username,
        githubUrl: githubUrl.value.trim(),
        email: document.getElementById('comm-input-email').value.trim(),
        areaOfInterest: document.getElementById('comm-select-area').value,
        bio: document.getElementById('comm-input-bio').value.trim(),
      };

      try {
        const response = await fetch(new URL('api/community', window.location.href), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || 'Registration could not be completed.');
        }

        registrationForm.reset();
        githubUrl.value = '';
        formStatus.textContent = 'Thanks for registering. Your details have been received.';
      } catch (error) {
        formStatus.textContent = error.message || 'Registration could not be completed. Please try again.';
        console.error('Unable to submit the community registration:', error);
      } finally {
        submitButton.disabled = false;
      }
    });
  }
})();
