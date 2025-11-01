using BackGroundService.DTO;
using BackGroundService.Logger;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;

namespace BackGroundService.Utils.SenderService
{
    internal class SenderService : ISenderService
    {
        private readonly HttpClient _httpClient;
        private readonly ILoggerService _logger;

        public SenderService(HttpClient httpClient, ILoggerService logger)
        { 
            _httpClient = httpClient;
            _logger = logger;
        }

        public async Task<bool> SendMessage(List<ResponseDTO> responses, CancellationToken cancellationToken = default)
        {
            try
            {
                var json = JsonSerializer.Serialize(responses);

                using var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync("/send", content, cancellationToken);

                if (response.IsSuccessStatusCode)
                {
                    _logger.DbInfo($"Успешно отправлено {responses.Count} ответов на сервер.");
                    return true;
                }
                else
                {
                    var responseText = await response.Content.ReadAsStringAsync(cancellationToken);
                    _logger.DbError($"Ошибка при отправке сообщений. Статус: {response.StatusCode}, Ответ: {responseText}");
                    return false;
                }
            }
            catch (OperationCanceledException)
            {
                _logger.DbInfo("Отправка сообщений была отменена.");
                return false;
            }
            catch (Exception ex)
            {
                _logger.DbError($"Ошибка при отправке сообщений: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> TestMessage()
        {
            var response = await _httpClient.GetAsync("/test/hello");
            return response.IsSuccessStatusCode;
        }

    }
}
